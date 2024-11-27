package internal

import "fmt"

type Language struct {
	Id         int32  `json:"id"`
	Name       string `json:"name"`
	SourceFile string `json:"-"`
	RunCmd     string `json:"-"`
	CompileCmd string `json:"-"`
}

var Languages = map[int32]Language{
	45: {
		Id:         45,
		Name:       "Assembly (NASM 2.16.03)",
		SourceFile: "main.asm",
		CompileCmd: "/usr/local/nasm-2.16.03/bin/nasm -f elf64 %s main.asm",
		RunCmd:     "./a.out",
	},
	48: {
		Id:         48,
		Name:       "C (GCC 10.2)",
		SourceFile: "main.c",
		CompileCmd: "/usr/local/gcc-10.2/bin/gcc %s main.c",
		RunCmd:     "./a.out",
	},
	49: {
		Id:         49,
		Name:       "C (GCC 11.5)",
		SourceFile: "main.c",
		CompileCmd: "/usr/local/gcc-11.5/bin/gcc %s main.c",
		RunCmd:     "./a.out",
	},
	50: {
		Id:         50,
		Name:       "C (GCC 12.4)",
		SourceFile: "main.c",
		CompileCmd: "/usr/local/gcc-12.4/bin/gcc %s main.c",
		RunCmd:     "./a.out",
	},
	51: {
		Id:         51,
		Name:       "C# (Mono 6.6.0.161)",
		SourceFile: "Main.cs",
		CompileCmd: "/usr/local/mono-6.6.0.161/bin/mcs %s Main.cs",
		RunCmd:     "/usr/local/mono-6.6.0.161/bin/mono Main.exe",
	},
	52: {
		Id:         52,
		Name:       "C++ (GCC 10.2)",
		SourceFile: "main.cpp",
		CompileCmd: "/usr/local/gcc-10.2/bin/g++ %s main.cpp",
		RunCmd:     "LD_LIBRARY_PATH=/usr/local/gcc-10.2/lib64 ./a.out",
	},
	53: {
		Id:         53,
		Name:       "C++ (GCC 11.5)",
		SourceFile: "main.cpp",
		CompileCmd: "/usr/local/gcc-11.5/bin/g++ %s main.cpp",
		RunCmd:     "LD_LIBRARY_PATH=/usr/local/gcc-11.5/lib64 ./a.out",
	},
	54: {
		Id:         54,
		Name:       "C++ (GCC 12.4)",
		SourceFile: "main.cpp",
		CompileCmd: "/usr/local/gcc-12.4/bin/g++ %s main.cpp",
		RunCmd:     "LD_LIBRARY_PATH=/usr/local/gcc-12.4/lib64 ./a.out",
	},
	55: {
		Id:         55,
		Name:       "Common Lisp (SBCL 2.4.9)",
		SourceFile: "script.lisp",
		RunCmd:     "ASDF_SBCL_VERSION=2.4.9 asdf exec sbcl --script script.lisp",
	},
	56: {
		Id:         56,
		Name:       "D (DMD 2.109.1)",
		SourceFile: "main.d",
		CompileCmd: "ASDF_DMD_VERSION=2.109.1 asdf exec dmd %s main.d",
		RunCmd:     "./main",
	},
	57: {
		Id:         57,
		Name:       "Elixir (1.17.3)",
		SourceFile: "script.exs",
		RunCmd:     "ASDF_ELIXIR_VERSION=1.17.3 asdf exec elixir script.exs",
	},
	58: {
		Id:         58,
		Name:       "Erlang (OTP 27.1.2)",
		SourceFile: "main.erl",
		RunCmd:     "/bin/sed -i '1s/^/\\n/' main.erl && ASDF_ERLANG_VERSION=27.1.2 asdf exec escript main.erl",
	},
	59: {
		Id:         59,
		Name:       "Fortran (GFortran 13.3)",
		SourceFile: "main.f90",
		CompileCmd: "/usr/bin/gfortran %s main.f90",
		RunCmd:     "LD_LIBRARY_PATH=/usr/local/gcc-13.3/lib64 ./a.out",
	},
	60: {
		Id:         60,
		Name:       "Go (1.23.2)",
		SourceFile: "main.go",
		CompileCmd: "ASDF_GOLANG_VERSION=1.23.2 GOCACHE=/tmp/.cache/go-build asdf exec go build %s main.go ",
		RunCmd:     "./main %s",
	},
	61: {
		Id:         61,
		Name:       "Haskell (7.8.4)",
		SourceFile: "main.hs",
		CompileCmd: "ASDF_GHC_VERSION=7.8.4 ASDF_HASKELL_VERSION=7.8.4 asdf exec ghc %s main.hs",
		RunCmd:     "./main %s",
	},
	62: {
		Id:         62,
		Name:       "Java (OpenJDK 23)",
		SourceFile: "Main.java",
		CompileCmd: "/usr/local/openjdk23/bin/javac %s Main.java",
		RunCmd:     "/usr/local/openjdk23/bin/java Main",
	},
	63: {
		Id:         63,
		Name:       "JavaScript (Bun 1.1.33)",
		SourceFile: "script.js",
		RunCmd:     "ASDF_BUN_VERSION=1.1.33 asdf exec bun script.js",
	},
	64: {
		Id:         64,
		Name:       "Lua (5.4.7)",
		SourceFile: "script.lua",
		CompileCmd: "asdf exec luac %s script.lua",
		RunCmd:     "ASDF_LUA_VERSION=5.4.7 asdf exec lua ./luac.out",
	},
	65: {
		Id:         65,
		Name:       "OCaml (5.2.0)",
		SourceFile: "main.ml",
		CompileCmd: "ocamlc %s main.ml",
		RunCmd:     "./a.out",
	},
	66: {
		Id:         66,
		Name:       "Octave (9.2.0)",
		SourceFile: "script.m",
		RunCmd:     "/usr/local/octave-9.2.0/bin/octave-cli -q --no-gui --no-history script.m",
	},
	67: {
		Id:         67,
		Name:       "Pascal (FPC 3.2.2)",
		SourceFile: "main.pas",
		CompileCmd: "/usr/local/fpc-3.2.2/bin/fpc %s main.pas",
		RunCmd:     "./main",
	},
	68: {
		Id:         68,
		Name:       "PHP (8.3.13)",
		SourceFile: "script.php",
		RunCmd:     "/usr/local/php-8.3.13/bin/php script.php",
	},
	69: {
		Id:         69,
		Name:       "Prolog (GNU Prolog 1.4.5)",
		SourceFile: "main.pro",
		CompileCmd: "PATH=\"/usr/lib/gprolog/bin:$PATH\" /usr/lib/gprolog/bin/gplc --no-top-level %s main.pro",
		RunCmd:     "./main",
	},
	70: {
		Id:         70,
		Name:       "Python (2.7.17)",
		SourceFile: "script.py",
		RunCmd:     "ASDF_PYTHON2_VERSION=2.7.17 ASDF_PYTHON_VERSION=2.7.17 asdf exec python2 script.py",
	},
	71: {
		Id:         71,
		Name:       "Python (3.12.7)",
		SourceFile: "script.py",
		RunCmd:     "ASDF_PYTHON3_VERSION=3.12.7 ASDF_PYTHON_VERSION=3.12.7 asdf exec python3 script.py",
	},
	72: {
		Id:         72,
		Name:       "Ruby (2.7.0)",
		SourceFile: "script.rb",
		RunCmd:     "ruby script.rb",
	},
	73: {
		Id:         73,
		Name:       "Rust (1.82.0)",
		SourceFile: "main.rs",
		CompileCmd: "ASDF_RUST_VERSION=1.82.0 asdf exec rustc %s main.rs",
		RunCmd:     "./main",
	},
	74: {
		Id:         74,
		Name:       "TypeScript (Bun 1.1.33)",
		SourceFile: "script.ts",
		RunCmd:     "ASDF_BUN_VERSION=1.1.33 asdf exec bun script.ts",
	},
	75: {
		Id:         75,
		Name:       "C (Clang 19.1.0)",
		SourceFile: "main.c",
		CompileCmd: "clang %s main.c",
		RunCmd:     "./a.out",
	},
	76: {
		Id:         76,
		Name:       "C++ (Clang 19.1.0)",
		SourceFile: "main.cpp",
		CompileCmd: "clang %s main.cpp",
		RunCmd:     "./a.out",
	},
	77: {
		Id:         77,
		Name:       "COBOL (GnuCOBOL 3.1.2)",
		SourceFile: "main.cob",
		CompileCmd: "/usr/local/gnucobol-3.1.2/bin/cobc -free -x %s main.cob",
		RunCmd:     "LD_LIBRARY_PATH=/usr/local/gnucobol-3.1.2/lib ./main",
	},
	78: {
		Id:         78,
		Name:       "Kotlin (2.0.21)",
		SourceFile: "Main.kt",
		CompileCmd: "ASDF_KOTLIN_VERSION=2.0.21 asdf exec kotlinc %s Main.kt",
		RunCmd:     "ASDF_KOTLIN_VERSION=2.0.21 asdf exec kotlin MainKt",
	},
	79: {
		Id:         79,
		Name:       "Objective-C (Clang 7.0.1)",
		SourceFile: "main.m",
		CompileCmd: "clang `gnustep-config --objc-flags | sed 's/-W[^ ]* //g'` `gnustep-config --base-libs | sed 's/-shared-libgcc//'` -I/usr/lib/gcc/x86_64-linux-gnu/8/include main.m %s",
		RunCmd:     "./a.out",
	},
	80: {
		Id:         80,
		Name:       "R (4.4.1)",
		SourceFile: "script.r",
		RunCmd:     "/usr/local/r-4.4.1/bin/Rscript script.r",
	},
	81: {
		Id:         81,
		Name:       "Scala (3.5.2)",
		SourceFile: "Main.scala",
		CompileCmd: "/usr/local/scala-3.5.2/bin/scalac %s Main.scala",
		RunCmd:     "/usr/local/scala-3.5.2/bin/scala run -cp . -M Main",
	},
	82: {
		Id:         82,
		Name:       "SQL (SQLite 3.27.2)",
		SourceFile: "script.sql",
		RunCmd:     "/bin/cat script.sql | /usr/bin/sqlite3 db.sqlite",
	},
	83: {
		Id:         83,
		Name:       "Swift (6.0.1)",
		SourceFile: "Main.swift",
		CompileCmd: "/usr/local/swift-6.0.1/bin/swiftc %s Main.swift",
		RunCmd:     "./Main",
	},
	84: {
		Id:         84,
		Name:       "Visual Basic.Net (vbnc 0.0.0.5943)",
		SourceFile: "Main.vb",
		CompileCmd: "/usr/bin/vbnc %s Main.vb",
		RunCmd:     "/usr/bin/mono Main.exe",
	},
	85: {
		Id:         85,
		Name:       "Perl (5.40.0)",
		SourceFile: "script.pl",
		RunCmd:     "/usr/bin/perl script.pl",
	},
	86: {
		Id:         86,
		Name:       "Clojure (1.11.2)",
		SourceFile: "main.clj",
		RunCmd:     "/usr/local/bin/clojure clojure main.clj",
	},
	87: {
		Id:         87,
		Name:       "Nim (2.2.0)",
		SourceFile: "main.nim",
		CompileCmd: "ASDF_NIM_VERSION=2.2.0 asdf exec nim compile %s main.nim",
		RunCmd:     "./main",
	},
	88: {
		Id:         88,
		Name:       "Groovy (4.0.23)",
		SourceFile: "script.groovy",
		CompileCmd: "/usr/local/groovy-4.0.23/bin/groovyc %s script.groovy",
		RunCmd:     "/usr/local/bin/java -cp \".:/usr/local/groovy-4.0.23/lib/*\" script",
	},
	90: {
		Id:         90,
		Name:       "C (GCC 13.3)",
		SourceFile: "main.c",
		CompileCmd: "/usr/local/gcc-13.3/bin/gcc %s -o a.out main.c",
		RunCmd:     "./a.out",
	},
	91: {
		Id:         91,
		Name:       "C++ (GCC 13.3)",
		SourceFile: "main.cpp",
		CompileCmd: "/usr/local/gcc-13.3/bin/g++ %s main.cpp",
		RunCmd:     "LD_LIBRARY_PATH=/usr/local/gcc-13.3/lib64 ./a.out",
	},
}

// ensure that code is not decoded
func BuildWrappedCommand(code string, langID int32, cliArgs *string, compileArgs *string) string {
	lang := Languages[langID]
	var cmpcmd = ""
	if lang.CompileCmd != "" {
		cmpcmd = fmt.Sprintf(lang.CompileCmd, "")
		if compileArgs != nil {
			cmpcmd = fmt.Sprintf(lang.CompileCmd, compileArgs)
		}
	}
	var runCmd = fmt.Sprintf(lang.RunCmd, "")
	if cliArgs != nil {
		runCmd = fmt.Sprintf(lang.RunCmd, cliArgs)
	}
	wrappedCmd := fmt.Sprintf(`
{
	# Write the source code to a file
	echo '%s' | base64 -d > %s
	
	# Create files for metrics
	touch /tmp/metrics.log
	touch /tmp/real.stderr
	
	# Compile if necessary
	%s
	
	# Start process monitoring in background
	{
			while true; do
					ps -o pid,ppid,rss,vsz,pcpu,comm >> /tmp/process_stats.log 2>/dev/null
					sleep 0.1
			done
	} &
	MONITOR_PID=$!
	
	# Redirect original stderr to our metrics file
	exec 3>&2 # Save original stderr
	exec 2>/tmp/metrics.log
	START_TIME=$(date +%%s.%%N)
	
	# Execute the program
	%s 2>/tmp/real.stderr
	EXIT_CODE=$?
	END_TIME=$(date +%%s.%%N)
	WALL_TIME=$(echo "$END_TIME - $START_TIME" | bc)
	
	# Kill the monitoring process
	kill $MONITOR_PID
	
	# Collect metrics
	{
			echo "Command exit code: $EXIT_CODE"
			echo "Wall clock time: $WALL_TIME"
			echo "=== Process Status ==="
			cat /proc/self/status
			echo "=== I/O Statistics ==="
			cat /proc/self/io
			echo "=== Process Statistics ==="
			cat /tmp/process_stats.log
			echo "=== Real STDERR ==="
			cat /tmp/real.stderr
	} >&2
	
	# Restore original stderr
	exec 2>&3
	exit $EXIT_CODE
}
`, code, lang.SourceFile,
		// If compile command exists, add error checking
		func() string {
			if cmpcmd != "" {
				return fmt.Sprintf(`%s
if [ $? -ne 0 ]; then
	echo "Compilation failed" >&2
	exit 2
fi`, cmpcmd)
			}
			return ""
		}(), runCmd)
	return wrappedCmd
}
