source "https://rubygems.org"

gem 'jekyll', '~> 4.2', '>= 4.1.1'
gem 'bundler'
gem 'kramdown'
gem 'rack-jekyll'
gem 'rake'
gem 'puma'


# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins

# Plugins
group :jekyll_plugins do
    gem 'devlopr', '~> 0.4.5'
    gem 'jgd', '~> 1.12'
    gem 'jekyll-paginate-v2', '~> 3.0.0'
    gem 'jekyll-gist', '~> 1.5.0'
    gem 'jekyll-seo-tag', '~> 2.8.0'
    gem 'jekyll-sitemap', '~> 1.4.0'
    gem 'jekyll-menus', '~> 0.6.1'
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 2.0.5"
  gem "tzinfo-data", "~> 1.2022.1"
end
