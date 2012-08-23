# Cakefile to document, compile, join and minify CoffeeScript files for
# client side apps. Just edit the config object literal.
#
# -jrmoran
#
# https://gist.github.com/1537200

fs            = require 'fs'
{exec, spawn} = require 'child_process'

# order of files in `inFiles` is important
config =
  srcDir:  './public/coffee'
  outDir:  './public/js'
  inFiles: [ 
    'universal'
    'listen'
    'directory' 
  ]
  outFile: 'app'
  yuic:    '~/Dropbox/toolbox/dotfiles/bin/yuicompressor-2.4.2.jar'

outJS    = "#{config.outDir}/#{config.outFile}"
strFiles = ("#{config.srcDir}/#{file}.coffee" for file in config.inFiles).join ' '

# deal with errors from child processes
exerr  = (err, sout,  serr)->
  process.stdout.write err  if err
  process.stdout.write sout if sout
  process.stdout.write serr if serr

task 'doc', 'generate documentation for *.coffee files', ->
  exec "docco #{config.srcDir}/*.coffee", exerr

# this will keep the non-minified compiled and joined file updated as files in
# `inFile` change.
task 'watch', 'watch and compile changes in source dir', ->
  watch = exec "coffee -j #{outJS}.js -cw #{strFiles}"
  watch.stdout.on 'data', (data)-> process.stdout.write data

task 'build', 'join and compile *.coffee files', ->
  exec "coffee -j #{outJS}.js -c #{strFiles}", exerr
  exec "uglifyjs -o #{outJS}-min.js #{outJS}.js", exerr
  # exec "java -jar #{config.yuic} #{outJS}.js -o #{outJS}.min.js", exerr

# task 'min', 'minify compiled *.js file', ->
#   exec "java -jar #{config.yuic} #{outJS}.js -o #{outJS}.min.js", exerr

task 'bam', 'build and minify', ->
  invoke 'build'
  invoke 'min'