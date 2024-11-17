## contents

## supported languages 

clicking any language takes you to the corresponding redirect page, which, you end up in same place after selecting language from dropdown.

* [Assembly (NASM 2.16.03)](https://code.cansu.dev/language/redirect/assembly)
* [Bash (5.0.0)](https://code.cansu.dev/language/redirect/bash)
* [C (GCC 7.4.0)](https://code.cansu.dev/language/redirect/c)
* [C++ (GCC 10.2)](https://code.cansu.dev/language/redirect/cpp)
* [Common Lisp (SBCL 2.4.9)](https://code.cansu.dev/language/redirect/lisp)
* [D (DMD 2.109.1)](https://code.cansu.dev/language/redirect/d)
* [Elixir (1.17.3)](https://code.cansu.dev/language/redirect/elixir)
* [Erlang (OTP 27.1.2)](https://code.cansu.dev/language/redirect/erlang)
* [Fortran (GFortran 13.3)](https://code.cansu.dev/language/redirect/fortran)
* [Go (1.23.2)](https://code.cansu.dev/language/redirect/go)
* [Haskell (7.8.4)](https://code.cansu.dev/language/redirect/haskell)
* [Java (OpenJDK 23)](https://code.cansu.dev/language/redirect/java)
* [JavaScript (Bun 1.1.33)](https://code.cansu.dev/language/redirect/javascript)
* [Lua (5.4.7)](https://code.cansu.dev/language/redirect/lua)
* [OCaml (5.2.0)](https://code.cansu.dev/language/redirect/ocaml)
* [Octave (9.2.0)](https://code.cansu.dev/language/redirect/octave)
* [Pascal (FPC 3.2.2)](https://code.cansu.dev/language/redirect/pascal)
* [PHP (8.3.13)](https://code.cansu.dev/language/redirect/php)
* [Prolog (GNU Prolog 1.4.5)](https://code.cansu.dev/language/redirect/prolog)
* [Python (2.7.17)](https://code.cansu.dev/language/redirect/python)
* [Ruby (2.7.0)](https://code.cansu.dev/language/redirect/ruby)
* [Rust (1.82.0)](https://code.cansu.dev/language/redirect/rust)
* [TypeScript (Bun 1.1.33)](https://code.cansu.dev/language/redirect/typescript)
* [COBOL (GnuCOBOL 3.1.2)](https://code.cansu.dev/language/redirect/cobol)
* [Kotlin (2.0.21)](https://code.cansu.dev/language/redirect/kotlin)
* [Objective-C (Clang 7.0.1)](https://code.cansu.dev/language/redirect/objectivec)
* [R (4.4.1)](https://code.cansu.dev/language/redirect/r)
* [Scala (3.5.2)](https://code.cansu.dev/language/redirect/scala)
* [SQL (SQLite 3.46.1.1)](https://code.cansu.dev/language/redirect/sql)
* [Swift (6.0.1)](https://code.cansu.dev/language/redirect/swift)
* [Visual Basic.Net (vbnc 0.0.0.5943)](https://code.cansu.dev/language/redirect/vbnc)
* [Perl (5.40.0)](https://code.cansu.dev/language/redirect/perl)
* [Clojure (1.11.2)](https://code.cansu.dev/language/redirect/clojure)
* [Nim (2.2.0)](https://code.cansu.dev/language/redirect/nim)
* [Groovy (4.0.23)](https://code.cansu.dev/language/redirect/groovy)

### available packages

wip

### notes

- Octave has no modes, so it is rendered as plain text.

## contact
mail [hello@cansu.dev](mailto:hello@cansu.dev) for all feedbacks, questions, suggestions, anything.

## changelog
### 2024-11-17
- added
  - instant redirect language pages, such as [https://code.cansu.dev/language/redirect/typescript](https://code.cansu.dev/language/redirect/typescript) old `/language/typescript` routes are still usable, but they are not recommended as their main purpose is to be SEO garbage.
- updated
  supported languages list with new redirect pages.
- fixed
  - almost every bug (there might be still problems with execution of some languages, please let me know)
- removed
  - anime girl companion now only reacts to your code after execution (before: after execution and one second inactivity in typing). sowwy.
  - initial view setting, added `go to readme` button right next to the settings icon instead.
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

