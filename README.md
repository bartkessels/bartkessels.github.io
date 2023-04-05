# Cannot install dependencies

When you get some error message saying you don't have permissions to install dependencies add the following to your shell

```zsh
$ export GEM_HOME="$HOME/.gem"
```

# Install dependencies

```zsh
$ bundle install
```

# Serve the website

```zsh
$ bundle exec jekyll serve
```
