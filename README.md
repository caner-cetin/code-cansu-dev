
## important note

i have archived and unarchived this repository, due to sheer anger and pure vitriol hatred towards vitejs and react. i am not using vitejs anymore, i hate anything that relies on vitejs, and i will only use vitejs if you pay me from now on. there is a tweet chain on x if you are interested in to read why (good luck finding it). 

so any further development is halted until nextjs migration is done. `haul` branch contains work in progress buggy code. thank you vitejs organization for breaking me mentally for a full week.

## beep


Code playground with 38 different environments, all with autocompletes, snippets, and syntax highlighters.

![alt text](static/main.png)

- [important note](#important-note)
- [beep](#beep)
- [features](#features)
- [supported languages](#supported-languages)
  - [available packages](#available-packages)
  - [notes](#notes)

## features

- Autocomplete and Snippets
![demo autocomplete](static/autocomplete-1.gif)
- Share Code Output
![demo share code](static/share.gif)
- Stdin Support
![demo stdin](static/stdin.gif)
- Execution and Loading Speed
![demo execution](static/exec.gif)
- Network Friendly

From Haskell to NASM to Prolog to Lua, run everything with under 2 MB of network, all autocompletes and snippets included.

As a comparison, with no cache, from initial load to output, JDoodle consumes 3.05 megabytes for only loading COBOL. My precious darling loads needs only 1.6 MB of network initially, 
for loading all languages. Language switch takes almost nothing, where as JDoodle transfers 6 MB of network just to switch from COBOL to Fortran. 

Cached initial network transfer is only 4 KB, and executions, submissions, etc. takes only a few kilobytes per query.

more to come, wip.

## supported languages

- Assembly (NASM)
- Bash 
- Basic
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
- F#
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

- python
  - mlxtend
  - numpy
  - pandas
  - scikit-learn
  - pytest
  - scipy

wip

### notes

- Basic and Octave has no modes, so they are rendered as plain text.
- readme.md in editor is the same as this file except there are no gifs.