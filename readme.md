## Serve the site

```zsh
$ bundle install
$ bundle exec jekyll serve
```

When getting errors that your ruby version is out-of-date, please check if you use the ruby that's installed through brew because the one macOS ships is probably outdated.

To (temporarily) set the `$PATH` to the brew ruby location execute this command (update the version if neccessary).

```zsh
$ export PATH=/usr/local/Cellar/ruby/3.3.O/bin:$PATH
$ export PATH=/usr/local/lib/ruby/gems/3.3.0/bin:$PATH
```

## Generate an image using Dall-E

> generate an image of ... in a minimalistic flat style

Some prompt examples

```
Generate an image of a table full of little elves in a minimalistic flat style
```

```
Generate an image of a computer screen with an IDE open and someone trying out the new primary constructor from C# in a minimalistic flat style
```