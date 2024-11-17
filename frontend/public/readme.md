## contents

## supported languages

- Assembly (NASM)
- Bash
- C (Clang)
- C++ (Clang)
- C (GCC)
- C++ (GCC)
- Clojure
- C# (Mono)
- COBOL
- Common Lisp
- D
- Elixir
- Erlang
- Nim
- Fortran
- Go
- Groovy
- Haskell
- Java
- JavaScript
- Kotlin
- Lua
- Objective-C
- OCaml
- Octave
- Pascal
- Perl
- PHP
- Prolog
- Python
- R
- Ruby
- Rust
- Scala
- SQL
- Swift
- TypeScript
- Visual Basic.NET

### available packages

wip

### notes

- Octave has no modes, so it is rendered as plain text.

## contact
mail [hello@cansu.dev](mailto:hello@cansu.dev) for all feedbacks, questions, suggestions, anything.

## changelog
### 2024-11-17
- fixed
  - almost every bug (there might be still problems with execution of some languages, please let me know)
- removed
  - anime girl companion now only reacts to your code after execution (before: after execution and one second inactivity in typing). sowwy.
### 2024-11-15
- updated
  - languages and settings menu ui
- fixed
  - live2d model now appears with no visual glitches. 
### 2024-11-7
- added
  - anime girl companion, can be disabled from settings.
  - she will always react to your submissions, and will react to your code upon one second inactivity in typing.
  - planning text to speech
- updated
  - language list is in now alphabetical order
- removed
  - my own sanity
### 2024-11-1
- added
  - language specific pages, such as [https://code.cansu.dev/language/typescript](https://code.cansu.dev/language/typescript) that redirects back to playground with selected language set as default.
  - `Unset` initial view, which renders README until a default language is set by being redirected from a language page, or a language is selected from dropdown. default is now `Unset` instead of `README`
- fixed
  - saved and default codes are now loading on first load with no other steps
  - code is now saved on quit. previously, code was only saved on language switch.
### 2024-10-27
- added
  - GCC compiler versions:
    - GCC 10.x
    - GCC 11.x
    - GCC 12.x
    - GCC 13.x
    - planned: GCC 3.x, 7.x, 8.x, 9.x, 14.x

  - language Support:
    - nim
    - bun runtime for js/ts

- changed
  - js/ts:
    - replaced node.js with bun as primary runtime
    - planned: support for multiple runtimes (deno, node.js, bun)
  
- updated
  - all compilers, interpreters, and runtimes updated to latest stable versions

- removed
  - F# (due to excessive file size needed for compiling)
  - BASIC

