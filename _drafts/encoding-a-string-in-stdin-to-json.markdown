---
title: "Encoding a string in STDIN to JSON"
date: 2018-07-25 18:01:04
toc: true
---
`... | python -c 'import json, sys; print( json.dumps( sys.stdin.read() ) );'`
