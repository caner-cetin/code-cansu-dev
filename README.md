
[main branch](https://code.cansu.dev)

[development branch](https://haul.code-cansu-dev.pages.dev) *unstable*

im currently migrating to nextjs, refactor, redesign parts here and there, so any feedbacks on development branch is welcome.

## beep


Code playground with 38 different environments, all with autocompletes, snippets, and syntax highlighters.

![alt text](static/main.png)

- [beep](#beep)
- [features](#features)
- [supported languages](#supported-languages)
  - [notes](#notes)
  - [next 13 is outdated](#next-13-is-outdated)

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

### notes

- Basic and Octave has no modes, so they are rendered as plain text.
- readme.md in editor is the same as this file except there are no gifs.

### next 13 is outdated
i know, next 15's node version is not supported by cloudflare pages build system, so i downgraded from next 15 to 14.
then my dummy page builds randomly stopped working with the error
```
Error occurred prerendering page "/language/swift". Read more: https://nextjs.org/docs/messages/prerender-error

TypeError: Cannot read properties of null (reading 'useContext')
    at exports.useContext (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/react/cjs/react.production.min.js:24:495)
    at Head (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/shared/lib/head.js:172:44)
    at nj (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:46251)
    at nM (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47571)
    at nN (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64546)
    at nI (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47010)
    at nM (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:47717)
    at nN (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64546)
    at nM (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:59102)
    at nN (/Users/canercetin/Git/cansu.dev/code/frontend/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:64546)
```
so i downgraded from next 14 to 13. then it started working again? 

i did not pick any of the package versions for frontend, i was simply forced to for every package. so please do not mention it. xoxo 