# Requirements

## Generating client/server

- <https://github.com/OpenAPITools/openapi-generator/tree/master?tab=readme-ov-file#1---installation>
  - `npm install @openapitools/openapi-generator-cli -g`

## Client

Der Client kann importiert und verwendet werden ohne das Anpassung im generierten Client Code selbst notwendig sind. Deshalb kann bei API Änderungen einfach ein neuer Client generiert werden ohne bedenken.

## Server

Die Python Generatoren sind alle subotimal. Die generierten Controller erlauben einen nicht über Handler oder ähnliches funktionalität einzubinden. Das bedeutet die eigene Implementation und der generierte Server Code ist vermischt.
Keine Ahnung warum Python Community das nicht hinkriegt. ¯\_(ツ)_/¯.
Das bedeutet sollte sich die API Spezifikation ändern:

1. server code generieren
2. geänderte Modelle oder ähnliches manuell rauspicken
3. nach src/server rüberkopieren
4. danach kann src/generated/server/ wieder gelöscht werden

Oder einfach manuell anpassen.
