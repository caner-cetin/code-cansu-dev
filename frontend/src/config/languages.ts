import { LanguageId } from "../services/settings";
import type { LanguageConfig } from "./types";

// https://github.com/ajaxorg/ace-builds/tree/cb4c7c3d105c92b04f45d78d329f5509b7098906/demo/kitchen-sink/docs
// nearly all default texts are from here, thanks to the ace-builds team for everything.
// ctrl+f is your friend
export const LANGUAGE_CONFIG: Record<number, LanguageConfig> = {
	74: {
		defaultText: `class Greeter {
	greeting: string;
	constructor (message: string) {
		this.greeting = message;
	}
	greet() {
		return "Hello, " + this.greeting;
	}
}   

var greeter = new Greeter("world");

var button = document.createElement('button')
button.innerText = <string>"Say Hello";
button.onclick = function() {
	alert(greeter.greet())
}

document.body.appendChild(button)

class Snake extends Animal {
   move() {
       alert("Slithering...");
       super(5);
   }
}

class Horse extends Animal {
   move() {
       alert("Galloping...");
       super.move(45);
   }
}

module Sayings {
    export class Greeter {
        greeting: string;
        constructor (message: string) {
            this.greeting = message;
        }
        greet() {
            return "Hello, " + this.greeting;
        }
    }
}
module Mankala {
   export class Features {
       public turnContinues = false;
       public seedStoredCount = 0;
       public capturedCount = 0;
       public spaceCaptured = NoSpace;

       public clear() {
           this.turnContinues = false;
           this.seedStoredCount = 0;
           this.capturedCount = 0;
           this.spaceCaptured = NoSpace;
       }

       public toString() {
           var stringBuilder = "";
           if (this.turnContinues) {
               stringBuilder += " turn continues,";
           }
           stringBuilder += " stores " + this.seedStoredCount;
           if (this.capturedCount > 0) {
               stringBuilder += " captures " + this.capturedCount + " from space " + this.spaceCaptured;
           }
           return stringBuilder;
       }
   }
}`,
		runnerName: "TypeScript (Bun 1.1.33)",
		mode: "typescript",
		iconClass: "devicon-typescript-plain",
		languageName: "TypeScript",
	},
	45: {
		defaultText: `section .text
global _start
_start:
    mov edx, len
    mov ecx, msg
    mov ebx, 1
    mov eax, 4
    int 0x80
    mov eax, 1
    int 0x80
section .data
msg db 'deniz abi kornaya bas', 0xa
len equ $ - msg`,
		runnerName: "Assembly (NASM 2.16.03)",
		mode: "assembly_x86",
		iconClass: "devicon-wasm-original",
		languageName: "Assembly",
	},
	46: {
		defaultText: `echo "deniz abi kornaya bas"`,
		runnerName: "Bash (5.0.0)",
		mode: "sh",
		iconClass: "devicon-bash-plain",
		languageName: "Bash",
	},
	// 47: {
	// 	extensionModule: () => Promise.resolve(),
	// 	defaultText: `PRINT "deniz abi kornaya bas"`,
	// 	runnerName: "Basic (FBC 1.07.1)",
	// 	mode: "text",
	// 	iconClass: "devicon-visualbasic-plain",
	// },
	75: {
		// C (Clang 19.1.0)
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		runnerName: "C (Clang 19.1.0)",
		mode: "c_cpp",
		iconClass: "devicon-c-line",
		languageName: "C",
	},
	76: {
		// C++ (Clang 19.1.0)
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		runnerName: "C++ (Clang 19.1.0)",
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
		languageName: "CPP",
	},
	48: {
		// C (GCC 7.4.0)
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		runnerName: "C (GCC 7.4.0)",
		mode: "c_cpp",
		iconClass: "devicon-c-line",
		languageName: "C",
	},
	52: {
		// C++ (GCC 10.2)
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		runnerName: "C++ (GCC 10.2)",
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
		languageName: "CPP",
	},
	49: {
		// C (GCC 11.5)
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		runnerName: "C (GCC 11.5)",
		mode: "c_cpp",
		iconClass: "devicon-c-line",
		languageName: "C",
	},
	53: {
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		runnerName: "C++ (GCC 11.5)",
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
		languageName: "CPP",
	},
	50: {
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		runnerName: "C (GCC 12.4)",
		mode: "c_cpp",
		iconClass: "devicon-c-line",
		languageName: "C",
	},
	54: {
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		runnerName: "C++ (GCC 12.4)",
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
		languageName: "CPP",
	},
	86: {
		defaultText: `(defn parting
  "returns a String parting in a given language"
  ([] (parting "World"))
  ([name] (parting name "en"))
  ([name language]
    ; condp is similar to a case statement in other languages.
    ; It is described in more detail later.
    ; It is used here to take different actions based on whether the
    ; parameter "language" is set to "en", "es" or something else.
    (condp = language
      "en" (str "Goodbye, " name)
      "es" (str "Adios, " name)
      (throw (IllegalArgumentException.
        (str "unsupported language " language))))))

(println (parting)) ; -> Goodbye, World
(println (parting "Mark")) ; -> Goodbye, Mark
(println (parting "Mark" "es")) ; -> Adios, Mark

(print (re-matches #"abc(.*)
            (r)" "abcxyz
            r") )`,
		runnerName: "Clojure (1.11.2)",
		mode: "clojure",
		iconClass: "devicon-clojure-line",
		languageName: "Clojure",
	},
	77: {
		defaultText: `*> ***************************************************************
       *> Purpose:   Say hello to GNU Cobol
       *> Tectonics: cobc -x bigworld.cob
       *> ***************************************************************
       identification division.
       program-id. bigworld.

       environment division.
       configuration section.

       data division.
       working-storage section.
       01 hello                pic $$$$,$$$,$$$,$$$,$$$,$$$.99.
       01 world                pic s9(18)v99 value zero.
       01 people               pic ZZZ,ZZZ,ZZZ,ZZ9.
       01 persons              pic 9(18) value 7182044470.
       01 each                 pic 9(5)v99 value 26202.42.

       procedure division.

       multiply persons by each giving world
           on size error
             display "We did it.  We broke the world bank" 
       end-multiply.

       move world to hello
       move persons to people

       display "Hello, world".
       display " ".

       display "On " function locale-date(20130927)
               " at " function locale-time(120000)
               ", according to UN estimates:".

       display "You were home to some " people " people,"
               " with an estimated worth of " hello.

       goback.
       end program bigworld.

    `,
		runnerName: "COBOL (GnuCOBOL 3.1.2)",
		mode: "cobol",
		iconClass: undefined,
		languageName: "COBOL",
	},
	55: {
		defaultText: `(defun whitespacep (char)
  "Checks if the given character is a whitespace character."
  (member char '(#\Space #\Tab #\Newline #\Return)))

(defun split-string (line)
  "Splits the input line into tokens based on whitespace."
  (let ((tokens '())
        (current-token "")
        (inside-token nil))
    (dolist (char (coerce line 'list))
      (cond
        ;; If the character is whitespace, push the current token and reset
        ((whitespacep char)
         (when inside-token
           (push current-token tokens)
           (setf current-token "")
           (setf inside-token nil)))
        ;; If not whitespace, add character to the current token
        (t
         (setf inside-token t)
         (setf current-token (concatenate 'string current-token (string char))))))
    ;; After finishing the loop, add any remaining token
    (when inside-token
      (push current-token tokens))
    (nreverse tokens)))

(defun prompt-for-cd (&optional (line "Floating-World Bowery-Electric 5") (beg 0))
  "Processes the CD data (without prompts)."
  ;; Split the line into tokens (without external libraries)
  (let* ((tokens (split-string line))
         (title (nth 0 tokens))   ; First token is the title
         (artist (nth 1 tokens))  ; Second token is the artist
         (rating (or (parse-integer (nth 2 tokens) :junk-allowed t) 0)))  ; Third token is the rating
    ;; Print the extracted values
    (format t "Title: ~a~%Artist: ~a~%Rating: ~d~%" title artist rating)
    (force-output)  ; Flush the output to ensure it is displayed
    ;; Print "Completed" after the logic is done
    (force-output)))  ; Ensure this output is also flushed

(prompt-for-cd)`,
		runnerName: "Common Lisp (SBCL 2.4.9)",
		mode: "lisp",
		iconClass: undefined,
		languageName: "Lisp",
	},
	56: {
		defaultText: `#!/usr/bin/env rdmd
// Computes average line length for standard input.
import std.stdio;

void main() {
    ulong lines = 0;
    double sumLength = 0;
    foreach (line; stdin.byLine()) {
        ++lines;
        sumLength += line.length;
    }
    writeln("Average line length: ",
        lines ? sumLength / lines : 0);
}
}`,
		runnerName: "D (DMD 2.109.1)",
		mode: "d",
		iconClass: undefined,
		languageName: "D",
	},
	57: {
		defaultText: `IO.puts "deniz abi kornaya bas"`,
		runnerName: "Elixir (1.17.3)",
		mode: "elixir",
		iconClass: "devicon-elixir-plain",
		languageName: "Elixir",
	},
	58: {
		defaultText: `-module(word_counter).
-export([main/1]).

main(_) ->
    %% Read input from stdin
    io:format("Enter text (press Ctrl+D to finish):~n"),
    Input = read_input(),
    process_input(Input).

read_input() ->
    %% Read lines until end of file (Ctrl+D)
    Lines = read_lines([]),
    %% Join lines into a single string
    string:join(Lines, " ").

read_lines(Acc) ->
    case io:get_line("") of
        eof -> 
            Acc;  % Return accumulated lines when EOF is reached
        Line -> 
            read_lines([string:trim(Line) | Acc])  % Accumulate trimmed lines
    end.

process_input(Input) ->
    %% Split the input into words
    Words = string:tokens(Input, " "),
    WordCount = length(Words),
    CharCount = string:len(Input),
    WordFreq = word_frequency(Words),
    
    %% Print results
    io:format("Total words: ~p~n", [WordCount]),
    io:format("Total characters (including spaces): ~p~n", [CharCount]),
    io:format("Word frequencies: ~p~n", [WordFreq]).

word_frequency(Words) ->
    lists:foldl(fun(W, Acc) -> 
        Map = maps:get(W, Acc, 0),  % Use maps instead of dict
        maps:put(W, Map + 1, Acc)   % Use maps to store frequency
    end, maps:new(), Words).
`,
		runnerName: "Erlang (OTP 27.1.2)",
		mode: "erlang",
		iconClass: "devicon-erlang-plain",
		languageName: "Erlang",
	},
	87: {
		defaultText: `from math import sqrt
import strformat

#---------------------------------------------------------------------------------------------------

proc sumProperDivisors(n: int): int =
  ## Compute the sum of proper divisors.
  ## "n" is supposed to be odd.
  result = 1
  for d in countup(3, sqrt(n.toFloat).int, 2):
    if n mod d == 0:
      inc result, d
      if n div d != d:
        inc result, n div d

#---------------------------------------------------------------------------------------------------

iterator oddAbundant(start: int): tuple[n, s: int] =
  ## Yield the odd abundant numbers and the sum of their proper
  ## divisors greater or equal to "start".
  var n = start + (start and 1 xor 1)   # Start with an odd number.
  while true:
    let s = n.sumProperDivisors()
    if s > n:
      yield (n, s)
    inc n, 2

#---------------------------------------------------------------------------------------------------

echo "List of 25 first odd abundant numbers."
echo "Rank  Number  Proper divisors sum"
echo "----  -----   -------------------"
var rank = 0
for (n, s) in oddAbundant(1):
  inc rank
  echo fmt"{rank:2}:   {n:5}   {s:5}"
  if rank == 25:
    break

echo ""
rank = 0
for (n, s) in oddAbundant(1):
  inc rank
  if rank == 1000:
    echo fmt"The 1000th odd abundant number is {n}."
    echo fmt"The sum of its proper divisors is {s}."
    break

echo ""
for (n, s) in oddAbundant(1_000_000_000):
  if n > 1_000_000_000:
    echo fmt"The first odd abundant number greater than 1000000000 is {n}."
    echo fmt"The sum of its proper divisors is {s}."
    break`,
		runnerName: "Nim (2.2.0)",
		mode: "nim",
		iconClass: "devicon-nim-plain",
		languageName: "Nim",
	},
	59: {
		defaultText: `program main
    implicit none

    integer, parameter :: g = 9.81
    real, allocatable :: array(:,:,:)
    integer :: a
    real*8 :: x, y

    ! Initialize x and y for the condition
    x = 3.0
    y = 1.0

    ! Allocate a 3D array (10x10x10)
    allocate(array(10, 10, 10), stat=a)
    if (a /= 0) then
        print*, "Array allocation failed!"
        stop
    endif

    ! Set values based on the condition
    if (x < 5.0) then
        array(:,:,:) = g
    else
        array(:,:,:) = x - y
    endif

    ! Print the first layer of the array to verify
    print*, "Array contents (first layer):"
    print*, array(:,:,1)

    ! Deallocate the array to free memory
    deallocate(array)

    return
end program main
`,
		runnerName: "Fortran (GFortran 13.3)",
		mode: "fortran",
		iconClass: "devicon-fortran-original",
		languageName: "Fortran",
	},
	60: {
		defaultText: `package main
import "fmt"
func main() {
    fmt.Println("deniz abi kornaya bas")
}`,
		runnerName: "Go (1.23.2)",
		mode: "golang",
		iconClass: "devicon-go-original-wordmark",
		languageName: "Go",
	},
	88: {
		defaultText: `println "deniz abi kornaya bas"`,
		runnerName: "Groovy (4.0.23)",
		mode: "groovy",
		iconClass: "devicon-groovy-plain",
		languageName: "Groovy",
	},
	61: {
		defaultText: `-- Type annotation (optional)
fib :: Int -> Integer

-- With self-referencing data
fib n = fibs !! n
        where fibs = 0 : scanl (+) 1 fibs
        -- 0,1,1,2,3,5,...

-- Uncomment one of the following implementations to use:

-- Same, coded directly
-- fib n = fibs !! n
--         where fibs = 0 : 1 : next fibs
--               next (a : t@(b:_)) = (a+b) : next t

-- Similar idea, using zipWith
-- fib n = fibs !! n
--         where fibs = 0 : 1 : zipWith (+) fibs (tail fibs)

-- Using a generator function
-- fib n = fibs (0,1) !! n
--         where fibs (a,b) = a : fibs (b,a+b)

-- Main function to demonstrate usage
main :: IO ()
main = do
    putStrLn "Fibonacci numbers:"
    print [fib n | n <- [0..10]]  -- Print the first 10 Fibonacci numbers`,
		runnerName: "Haskell (7.8.4)",
		mode: "haskell",
		iconClass: "devicon-haskell-plain",
		languageName: "Haskell",
	},
	62: {
		defaultText: `public class Main {
    public static void main(String[] args) {
        System.out.println("deniz abi kornaya bas");
    }
}`,
		runnerName: "Java (OpenJDK 23)",
		mode: "java",
		iconClass: "devicon-java-plain",
		languageName: "Java",
	},
	63: {
		defaultText: `console.log("deniz abi kornaya bas")`,
		runnerName: "JavaScript (Bun 1.1.33)",
		mode: "javascript",
		iconClass: "devicon-javascript-plain",
		languageName: "JavaScript",
	},
	78: {
		defaultText: `fun main() {
    println("deniz abi kornaya bas")
}`,
		runnerName: "Kotlin (2.0.21)",
		mode: "kotlin",
		iconClass: "devicon-kotlin-plain",
		languageName: "Kotlin",
	},
	64: {
		defaultText: `--[[--
num_args takes in 5.1 byte code and extracts the number of arguments
from its function header.
--]]--

function int(t)
	return t:byte(1)+t:byte(2)*0x100+t:byte(3)*0x10000+t:byte(4)*0x1000000
end

function num_args(func)
	local dump = string.dump(func)
	local offset, cursor = int(dump:sub(13)), offset + 26
	--Get the params and var flag (whether there's a ... in the param)
	return dump:sub(cursor):byte(), dump:sub(cursor+1):byte()
end

-- Usage:
num_args(function(a,b,c,d, ...) end) -- return 4, 7

-- Python styled string format operator
local gm = debug.getmetatable("")

gm.__mod=function(self, other)
    if type(other) ~= "table" then other = {other} end
    for i,v in ipairs(other) do other[i] = tostring(v) end
    return self:format(unpack(other))
end

print([===[
    blah blah %s, (%d %d)
]===]%{"blah", num_args(int)})

--[=[--
table.maxn is deprecated, use # instead.
--]=]--
print(table.maxn{1,2,[4]=4,[8]=8}) -- outputs 8 instead of 2

print(5 --[[ blah ]])`,
		runnerName: "Lua (5.4.7)",
		mode: "lua",
		iconClass: "devicon-lua-plain",
		languageName: "Lua",
	},
	79: {
		// Objective-C (Clang 7.0.1)
		defaultText: `#import <Foundation/Foundation.h>

// Define a protocol named Printing
@protocol Printing <NSObject>
- (void)print;
@end

// Define a class named Fraction that conforms to the Printing and NSCopying protocols
@interface Fraction : NSObject <Printing, NSCopying> {
    int numerator;
    int denominator;
}

// Method declarations
- (void)setNumerator:(int)n;
- (void)setDenominator:(int)d;
- (int)getNumerator;
- (int)getDenominator;

@end

// Implementation of the Fraction class
@implementation Fraction

- (void)setNumerator:(int)n {
    numerator = n;
}

- (void)setDenominator:(int)d {
    if (d != 0) {
        denominator = d;
    } else {
        NSLog(@"Denominator cannot be zero.");
    }
}

- (int)getNumerator {
    return numerator;
}

- (int)getDenominator {
    return denominator;
}

// Implementing the print method
- (void)print {
    NSLog(@"Fraction: %d/%d", numerator, denominator);
}

// Implementing the copy method from NSCopying protocol
- (id)copyWithZone:(NSZone *)zone {
    Fraction *copy = [[[self class] allocWithZone:zone] init];
    copy->numerator = numerator;
    copy->denominator = denominator;
    return copy;
}

@end

// Main function
int main(int argc, const char *argv[]) {
    @autoreleasepool {
        printf("hello world\n");
        
        // Create a Fraction object
        Fraction *frac = [[Fraction alloc] init];
        [frac setNumerator:3];
        [frac setDenominator:4];
        [frac print];
        
        // Example error handling
        @try {
            if (argc > 1) {
                @throw [NSException exceptionWithName:@"TestException" 
                                               reason:@"Testing the @throw directive." 
                                             userInfo:nil];
            }
        } @catch (NSException *exception) {
            NSLog(@"%@", exception);
        } @finally {
            NSLog(@"This always happens.");
        }
    }
    return 0;
}`,
		runnerName: "Objective-C (Clang 7.0.1)",
		mode: "objectivec",
		iconClass: "devicon-objectivec-plain",
		languageName: "ObjectiveC",
	},
	65: {
		defaultText: `(* Define a type for the return record, making it polymorphic *)
type 'a return_t = { return: 'a -> 'a }

(* with_return function with proper record usage *)
let with_return (type t) (f : 'a return_t -> t) =
  let module M = struct exception Return of t end in
  let return = { return = (fun x -> raise (M.Return x)) } in
  try f return with M.Return x -> x

(* Function that uses the 'early return' functionality provided by with_return *)
let sum_until_first_negative list =
  with_return (fun r ->
    List.fold list ~init:0 ~f:(fun acc x ->
      if x >= 0 then acc + x else r.return acc
    )
  )

(* Example usage *)
let () =
  let result = sum_until_first_negative [1; 2; 3; -1; 5] in
  Printf.printf "Result: %d\n" result
`,
		runnerName: "OCaml (5.2.0)",
		mode: "ocaml",
		iconClass: "devicon-ocaml-plain",
		languageName: "OCaml",
	},
	66: {
		defaultText: `disp("deniz abi kornaya bas")`,
		runnerName: "Octave (9.2.0)",
		mode: "text",
		iconClass: undefined,
		languageName: "Octave",
	},
	67: {
		defaultText: `(*****************************************************************************
 * A simple bubble sort program.  Reads integers, one per line, and prints   *
 * them out in sorted order.  Blows up if there are more than 49.            *
 *****************************************************************************)
PROGRAM Sort(input, output);
    CONST
        (* Max array size. *)
        MaxElts = 50;
    TYPE 
        (* Type of the element array. *)
        IntArrType = ARRAY [1..MaxElts] OF Integer;

    VAR
        (* Indexes, exchange temp, array size. *)
        i, j, tmp, size: integer;

        (* Array of ints *)
        arr: IntArrType;

    (* Read in the integers. *)
    PROCEDURE ReadArr(VAR size: Integer; VAR a: IntArrType); 
        BEGIN
            size := 1;
            WHILE NOT eof DO BEGIN
                readln(a[size]);
                IF NOT eof THEN 
                    size := size + 1
            END
        END;

    BEGIN
        (* Read *)
        ReadArr(size, arr);

        (* Sort using bubble sort. *)
        FOR i := size - 1 DOWNTO 1 DO
            FOR j := 1 TO i DO 
                IF arr[j] > arr[j + 1] THEN BEGIN
                    tmp := arr[j];
                    arr[j] := arr[j + 1];
                    arr[j + 1] := tmp;
                END;

        (* Print. *)
        FOR i := 1 TO size DO
            writeln(arr[i])
    END.
            `,
		runnerName: "Pascal (FPC 3.2.2)",
		mode: "pascal",
		iconClass: undefined,
		languageName: "Pascal",
	},
	85: {
		defaultText: `#!perl
# https://rosettacode.org/wiki/Bernoulli_numbers#Perl
use strict;
use warnings;
use List::Util qw(max);
use Math::BigRat;

my $one = Math::BigRat->new(1);
sub bernoulli_print {
	my @a;
	for my $m ( 0 .. 60 ) {
		push @a, $one / ($m + 1);
		for my $j ( reverse 1 .. $m ) {
				# This line:
				( $a[$j-1] -= $a[$j] ) *= $j;
				# is a faster version of the following line:
				# $a[$j-1] = $j * ($a[$j-1] - $a[$j]);
				# since it avoids unnecessary object creation.
		}
		next unless $a[0];
		printf "B(%2d) = %44s/%s\n", $m, $a[0]->parts;
	}
}

bernoulli_print();
`,
		runnerName: "Perl (5.40.0)",
		mode: "perl",
		iconClass: "devicon-perl-plain",
		languageName: "Perl",
	},
	68: {
		defaultText: `<?php
// https://rosettacode.org/wiki/99_bottles_of_beer#PHP
$plural = 's';
foreach (range(99, 1) as $i) {
    echo "$i bottle$plural of beer on the wall,\n";
    echo "$i bottle$plural of beer!\n";
    echo "Take one down, pass it around!\n";
    if ($i - 1 == 1)
        $plural = '';
    
    if ($i > 1)
        echo ($i - 1) . " bottle$plural of beer on the wall!\n\n";
    else
        echo "No more bottles of beer on the wall!\n";
}
?>`,
		runnerName: "PHP (8.3.13)",
		mode: "php",
		iconClass: "devicon-php-plain",
		languageName: "PHP",
	},
	69: {
		defaultText: `partition([], _, [], []).
partition([X|Xs], Pivot, Smalls, Bigs) :-
    (   X @< Pivot ->
        Smalls = [X|Rest],
        partition(Xs, Pivot, Rest, Bigs)
    ;   Bigs = [X|Rest],
        partition(Xs, Pivot, Smalls, Rest)
    ).
 
quicksort([])     --> [].
quicksort([X|Xs]) -->
    { partition(Xs, X, Smaller, Bigger) },
    quicksort(Smaller), [X], quicksort(Bigger).

perfect(N) :-
    between(1, inf, N), U is N // 2,
    findall(D, (between(1,U,D), N mod D =:= 0), Ds),
    sumlist(Ds, N).`,
		runnerName: "Prolog (GNU Prolog 1.4.5)",
		mode: "prolog",
		iconClass: "devicon-prolog-plain",
		languageName: "Prolog",
	},
	70: {
		defaultText: `print("deniz abi kornaya bas")`,
		runnerName: "Python (2.7.17)",
		mode: "python",
		iconClass: "devicon-python-plain",
		languageName: "Python",
	},
	71: {
		defaultText: `print("deniz abi kornaya bas")`,
		runnerName: "Python (3.12.7)",
		mode: "python",
		iconClass: "devicon-python-plain",
		languageName: "Python",
	},
	80: {
		defaultText: `Call:
lm(formula = y ~ x)
 
Residuals:
1       2       3       4       5       6
3.3333 -0.6667 -2.6667 -2.6667 -0.6667  3.3333
 
Coefficients:
            Estimate Std. Error t value Pr(>|t|)
(Intercept)  -9.3333     2.8441  -3.282 0.030453 *
x             7.0000     0.7303   9.585 0.000662 ***
---
Signif. codes:  0 ‘***’ 0.001 ‘**’ 0.01 ‘*’ 0.05 ‘.’ 0.1 ‘ ’ 1
 
Residual standard error: 3.055 on 4 degrees of freedom
Multiple R-squared: 0.9583,     Adjusted R-squared: 0.9478
F-statistic: 91.88 on 1 and 4 DF,  p-value: 0.000662
 
> par(mfrow=c(2, 2))     # Request 2x2 plot layout
> plot(lm_1)             # Diagnostic plot of regression model`,
		runnerName: "R (4.4.1)",
		mode: "r",
		iconClass: undefined,
		languageName: "R",
	},
	72: {
		defaultText: `puts "deniz abi kornaya bas"`,
		runnerName: "Ruby (2.7.0)",
		mode: "ruby",
		iconClass: "devicon-ruby-plain",
		languageName: "Ruby",
	},
	73: {
		defaultText: `use std::thread; // Import the thread module

fn main() {
    let names = ["Alice", "Bob", "Carol"]; // Define names array

    for &name in &names { // Iterate over the names array
        thread::spawn(move || { // Spawn a new thread
            let nums = [1, 2, 3]; // Define a fixed array of numbers

            // Print messages in a fixed order
            for &num in &nums { // Iterate over the numbers
                println!("{} says: '{}'", name, num + 1); // Print the message
            }
        });
    }

    // Sleep to allow threads to complete (for demonstration purposes)
    thread::sleep(std::time::Duration::from_secs(1));
}

// The map function
fn map<T, U, F>(vector: &[T], function: F) -> Vec<U> 
where 
    F: Fn(&T) -> U // Specify that F is a function type
{
    let mut accumulator = Vec::new(); // Initialize a vector
    for element in vector {
        accumulator.push(function(element)); // Apply the function and push to the accumulator
    }
    accumulator // Return the accumulated results
}

// Example struct and trait definitions without const generics
struct GenericStruct<T>(Vec<T>); // Use Vec to store elements

trait GenericTrait<T> {
    // Define the trait methods
}

impl GenericTrait<i32> for i32 {
    // Implement the trait for i32
}

trait Trait<T> {
    // Define trait methods
}

impl<T> Trait<T> for GenericStruct<T> {
    // Implement Trait for GenericStruct
}

// Example of the macro
macro_rules! mac_variant {
    ($vis:vis $name:ident) => {
        enum $name {
            $vis Unit,
            $vis Tuple(u8, u16),
            $vis Struct { f: u8 },
        }
    }
}
`,
		runnerName: "Rust (1.82.0)",
		mode: "rust",
		iconClass: "devicon-rust-original",
		languageName: "Rust",
	},
	81: {
		defaultText: `object Main {
  @volatile var pingCount = 0
  @volatile var pongCount = 0
  @volatile var pingsLeft = 100

  def main(args: Array[String]): Unit = {
    val pingThread = new Thread(new Runnable {
      def run(): Unit = {
        println("Ping: Starting.")
        while (pingsLeft > 0) {
          pingCount += 1
          println(s"Ping: Sending ping $pingCount")
          Thread.sleep(50) // Simulate some delay
          pongCount += 1 // Simulate receiving a pong
          if (pingCount % 10 == 0) {
            println(s"Ping: pong from Pong")
          }
          pingsLeft -= 1
        }
        println("Ping: Stop.")
      }
    })

    val pongThread = new Thread(new Runnable {
      def run(): Unit = {
        while (pingCount < 100) {
          if (pongCount > 0) {
            println(s"Pong: Received ping $pongCount")
            pongCount -= 1
            Thread.sleep(50) // Simulate some processing delay
          }
        }
        println("Pong: Stop.")
      }
    })

    pingThread.start()
    pongThread.start()

    pingThread.join()
    pongThread.join()
  }
}
`,
		runnerName: "Scala (3.5.2)",
		mode: "scala",
		iconClass: "devicon-scala-plain",
		languageName: "Scala",
	},
	82: {
		defaultText: `SELECT "deniz abi kornaya bas"`,
		runnerName: "SQL (SQLite 3.46.1.1)",
		mode: "sql",
		iconClass: "devicon-sqlite-plain",
		languageName: "SQL",
	},
	83: {
		defaultText: `print("deniz abi kornaya bas")`,
		runnerName: "Swift (6.0.1)",
		mode: "swift",
		iconClass: "devicon-swift-plain",
		languageName: "Swift",
	},
	84: {
		defaultText: `Imports System

Public Module Hello
   Public Sub Main(  )
      Console.WriteLine("hello, world")
   End Sub
End Module`,
		runnerName: "Visual Basic.Net (vbnc 0.0.0.5943)",
		mode: "text",
		iconClass: "devicon-visualbasic-plain",
		languageName: "VBNC",
	},
	[LanguageId.CGCC13]: {
		//  C (GCC 13.3)
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		runnerName: "C (GCC 13.3)",
		mode: "c_cpp",
		iconClass: "devicon-c-line",
		languageName: "C",
	},
	[LanguageId.CPPGCC13]: {
		// C++ (GCC 13.3)
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		runnerName: "C++ (GCC 13.3)",
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
		languageName: "CPP",
	},
};
