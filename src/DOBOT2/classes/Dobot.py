import serial
import struct
import time
import threading
import warnings
import cherrypy

from .Position import Position
from .Message import Message
from .Enums import ControlValues, PTPMode, CommunicationProtocolIDs, ConnectState

class Dobot:

    def __init__(self, port, verbose=False):
        threading.Thread.__init__(self)

        self._on = True
        self.verbose = verbose
        self.lock = threading.Lock()
        self.ser = serial.Serial(port,
                                 baudrate=115200,
                                 parity=serial.PARITY_NONE,
                                 stopbits=serial.STOPBITS_ONE,
                                 bytesize=serial.EIGHTBITS,
                                 timeout=3,
                                 write_timeout=3)
        is_open = self.ser.isOpen()
        self.state = ConnectState.CONNECTED if is_open else ConnectState.NOT_CONNECTED
        if self.verbose:
            print('pydobot: %s open' % self.ser.name if is_open else 'failed to open serial port')

        # self._set_queued_cmd_start_exec()
        self._set_queued_cmd_clear()
        self._set_ptp_joint_params(200, 200, 200, 200, 200, 200, 200, 200)
        self._set_ptp_coordinate_params(velocity=100, acceleration=100)
        self._set_ptp_jump_params(10, 200)
        self._set_ptp_common_params(velocity=100, acceleration=100)
        self._get_pose()
        return

    def _get_queued_cmd_current_index(self):
        '''
            Gets the current command index
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.GET_QUEUED_CMD_CURRENT_INDEX
        response = self._send_command(msg)
        if not response:
            return response
        idx = struct.unpack_from('L', response.params, 0)[0]
        return idx

    def _get_pose(self):
        '''
            Gets the real-time pose of the Dobot
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.GET_POSE
        response = self._send_command(msg)
        if response:
            self.x = struct.unpack_from('f', response.params, 0)[0]
            self.y = struct.unpack_from('f', response.params, 4)[0]
            self.z = struct.unpack_from('f', response.params, 8)[0]
            self.r = struct.unpack_from('f', response.params, 12)[0]
            self.j1 = struct.unpack_from('f', response.params, 16)[0]
            self.j2 = struct.unpack_from('f', response.params, 20)[0]
            self.j3 = struct.unpack_from('f', response.params, 24)[0]
            self.j4 = struct.unpack_from('f', response.params, 28)[0]

            if self.verbose:
                print("pydobot: x:%03.1f \
                                y:%03.1f \
                                z:%03.1f \
                                r:%03.1f \
                                j1:%03.1f \
                                j2:%03.1f \
                                j3:%03.1f \
                                j4:%03.1f" %
                    (self.x, self.y, self.z, self.r, self.j1, self.j2, self.j3, self.j4))
        return response

    def _read_message(self,retries=5):
        for x in range(retries):
            time.sleep(0.1)
            b = self.ser.read_all()
            if len(b) > 0:
                msg = Message(b)
                if self.verbose:
                    print('pydobot: <<', msg)
                return msg
        return

    def _send_command(self, msg, wait=False):
        self.lock.acquire()
        try:
            self._send_message(msg)
            response = self._read_message()
        except serial.SerialException as e:
            self.lock.release()
            self.close()
            self.state = ConnectState.NOT_CONNECTED
            print("pydobot: command resulted in error. Disconnecting.")
            return None
        except serial.SerialTimeoutException as e:
            self.lock.release()
            self.close()
            self.state = ConnectState.NOT_CONNECTED
            print("pydobot: command resulted in timeout error. Disconnecting.")
            return None

        self.lock.release()

        if not response:
            self.close()
            self.state = ConnectState.NOT_CONNECTED
            if self.verbose:
                print("pydobot: command response not received")
            return None

        if not wait:
            return response

        expected_idx = struct.unpack_from('L', response.params, 0)[0]
        if self.verbose:
            print('pydobot: waiting for command', expected_idx)

        while True:
            current_idx = self._get_queued_cmd_current_index()

            if current_idx != expected_idx:
                time.sleep(0.1)
                continue

            if self.verbose:
                print('pydobot: command %d executed' % current_idx)
            break

        return response

    def _send_message(self, msg):
        time.sleep(0.1)
        if self.verbose:
            print('pydobot: >>', msg)
        self.ser.write(msg.bytes())
        return

    def _set_cp_cmd(self, x, y, z):
        '''
            Executes the CP Command
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_CP_CMD
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray(bytes([0x01]))
        msg.params.extend(bytearray(struct.pack('f', x)))
        msg.params.extend(bytearray(struct.pack('f', y)))
        msg.params.extend(bytearray(struct.pack('f', z)))
        msg.params.append(0x00)
        return self._send_command(msg)

    def _set_end_effector_gripper(self, enable=False):
        '''
            Sets the status of the gripper
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_END_EFFECTOR_GRIPPER
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray([0x01]))
        if enable is True:
            msg.params.extend(bytearray([0x01]))
        else:
            msg.params.extend(bytearray([0x00]))
        return self._send_command(msg)

    def _set_end_effector_suction_cup(self, enable=False):
        '''
            Sets the status of the suction cup
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_END_EFFECTOR_SUCTION_CUP
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray([0x01]))
        if enable is True:
            msg.params.extend(bytearray([0x01]))
        else:
            msg.params.extend(bytearray([0x00]))
        return self._send_command(msg)

    def _set_ptp_joint_params(self, v_x, v_y, v_z, v_r, a_x, a_y, a_z, a_r):
        '''
            Sets the velocity ratio and the acceleration ratio in PTP mode
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_PTP_JOINT_PARAMS
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray(struct.pack('f', v_x)))
        msg.params.extend(bytearray(struct.pack('f', v_y)))
        msg.params.extend(bytearray(struct.pack('f', v_z)))
        msg.params.extend(bytearray(struct.pack('f', v_r)))
        msg.params.extend(bytearray(struct.pack('f', a_x)))
        msg.params.extend(bytearray(struct.pack('f', a_y)))
        msg.params.extend(bytearray(struct.pack('f', a_z)))
        msg.params.extend(bytearray(struct.pack('f', a_r)))
        return self._send_command(msg)

    def _set_ptp_coordinate_params(self, velocity, acceleration):
        '''
            Sets the velocity and acceleration of the Cartesian coordinate axes in PTP mode
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_PTP_COORDINATE_PARAMS
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray(struct.pack('f', velocity)))
        msg.params.extend(bytearray(struct.pack('f', velocity)))
        msg.params.extend(bytearray(struct.pack('f', acceleration)))
        msg.params.extend(bytearray(struct.pack('f', acceleration)))
        return self._send_command(msg)

    def _set_ptp_jump_params(self, jump, limit):
        '''
        Sets the lifting height and the maximum lifting height in JUMP mode
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_PTP_JUMP_PARAMS
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray(struct.pack('f', jump)))
        msg.params.extend(bytearray(struct.pack('f', limit)))
        return self._send_command(msg)


    def _set_ptp_common_params(self, velocity, acceleration):
        '''
            Sets the velocity ratio, acceleration ratio in PTP mode
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_PTP_COMMON_PARAMS
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray(struct.pack('f', velocity)))
        msg.params.extend(bytearray(struct.pack('f', acceleration)))
        return self._send_command(msg)

    def _get_ptp_common_params(self):
        '''
            Gets the velocity ratio, acceleration ratio in PTP mode
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_GET_PTP_COMMON_PARAMS
        msg.ctrl = ControlValues.ZERO
        response = self._send_command(msg)
        if not response:
            return response
        v = struct.unpack_from('f', response.params, 0)[0]
        a = struct.unpack_from('f', response.params, 4)[0]
        if self.verbose:
            print("pydobot: v:%03.1f \
                            a:%03.1f" %
                  (v, a))
        return (v, a)


    def _set_ptp_cmd(self, x, y, z, r, mode, wait):
        '''
            Executes PTP command
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_PTP_CMD
        msg.ctrl = ControlValues.THREE
        msg.params = bytearray([])
        msg.params.extend(bytearray([mode.value]))
        msg.params.extend(bytearray(struct.pack('f', x)))
        msg.params.extend(bytearray(struct.pack('f', y)))
        msg.params.extend(bytearray(struct.pack('f', z)))
        msg.params.extend(bytearray(struct.pack('f', r)))
        return self._send_command(msg, wait)

    def _set_queued_cmd_clear(self):
        '''
            Clears command queue
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_QUEUED_CMD_CLEAR
        msg.ctrl = ControlValues.ONE
        return self._send_command(msg)

    def _set_queued_cmd_start_exec(self):
        '''
            Start command
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_QUEUED_CMD_START_EXEC
        msg.ctrl = ControlValues.ONE
        return self._send_command(msg)

    def _set_queued_cmd_stop_exec(self):
        '''
            Stop command
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_QUEUED_CMD_STOP_EXEC
        msg.ctrl = ControlValues.ONE
        return self._send_command(msg)

    def _set_home_cmd(self):
        '''
            Home command
        '''
        msg = Message()
        msg.id = CommunicationProtocolIDs.SET_HOME_CMD
        msg.ctrl = ControlValues.THREE
        return self._send_command(msg, wait=True)

    def close(self):
        self._on = False
        if self.verbose:
            print('pydobot: %s closing' % self.ser.name)
        self.lock.acquire()
        try:
            self.ser.close()
        except serial.SerialException as e:
            pass
        self.state = ConnectState.CONNECTED if self.ser and self.ser.isOpen() else ConnectState.NOT_CONNECTED
        if self.verbose:
            print('pydobot: %s closed' % self.ser.name)
        self.lock.release()
        return

    def go(self, x, y, z, r=0.):
        warnings.warn('go() is deprecated, use move_to() instead')
        self.move_to(x, y, z, r)
        return

    def move_to(self, x, y, z, r, wait=False, mode=PTPMode.MOVJ_XYZ):
        self._set_ptp_cmd(x, y, z, r, mode=mode, wait=wait)
        return

    def move_to_p(self, position, wait=False, mode=PTPMode.MOVJ_XYZ):
        if mode in [PTPMode.MOVJ_XYZ, PTPMode.MOVL_XYZ, PTPMode.JUMP_XYZ]: 
            self._set_ptp_cmd(position.x, position.y, position.z, position.r, mode=mode, wait=wait)
        elif mode in [PTPMode.MOVJ_ANGLE, PTPMode.MOVL_ANGLE, PTPMode.JUMP_ANGLE]:
            self._set_ptp_cmd(position.j1, position.j2, position.j3, position.j4, mode=mode, wait=wait)
        return

    def suck(self, enable):
        self._set_end_effector_suction_cup(enable)
        return

    def grip(self, enable):
        self._set_end_effector_gripper(enable)
        return

    def set_speed(self, velocity=100., acceleration=100.):
        self._set_ptp_common_params(velocity, acceleration)
        self._set_ptp_coordinate_params(velocity, acceleration)
        return

    def get_speed(self):
        return self._get_ptp_common_params()

    def pose(self):
        response = self._get_pose()
        x = struct.unpack_from('f', response.params, 0)[0]
        y = struct.unpack_from('f', response.params, 4)[0]
        z = struct.unpack_from('f', response.params, 8)[0]
        r = struct.unpack_from('f', response.params, 12)[0]
        j1 = struct.unpack_from('f', response.params, 16)[0]
        j2 = struct.unpack_from('f', response.params, 20)[0]
        j3 = struct.unpack_from('f', response.params, 24)[0]
        j4 = struct.unpack_from('f', response.params, 28)[0]
        return x, y, z, r, j1, j2, j3, j4

    def pose_p(self):
        response = self._get_pose()
        x = struct.unpack_from('f', response.params, 0)[0]
        y = struct.unpack_from('f', response.params, 4)[0]
        z = struct.unpack_from('f', response.params, 8)[0]
        r = struct.unpack_from('f', response.params, 12)[0]
        j1 = struct.unpack_from('f', response.params, 16)[0]
        j2 = struct.unpack_from('f', response.params, 20)[0]
        j3 = struct.unpack_from('f', response.params, 24)[0]
        j4 = struct.unpack_from('f', response.params, 28)[0]
        return Position(x, y, z, r, j1, j2, j3, j4, 'Pose')

    def home(self):
        self._set_home_cmd()
        return

    def path_p(self, positions, wait=False, mode=PTPMode.MOVJ_XYZ):
        pass