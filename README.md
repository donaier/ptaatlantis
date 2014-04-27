[![Build Status](https://magnum.travis-ci.com/screenconcept/rails_template.png?token=psdcMxkyNCqZmxGAryjL)](https://magnum.travis-ci.com/screenconcept/rails_template)

# Setup

checkout with (is there something better than this?)

```
  $ git clone --depth=1 git@github.com:screenconcept/rails_template.git new_app_directory
  $ cd new_app_directory
  $ rm -rf .git/
```

edit your '.env' file
```
  $ vim .env
```

Finally edit the hosting information for blazing

```
  $ vim config/blazing.rb
```

# First Deploy / dotenv

We are setting the secret environment variables via the [dotenv gem](https://github.com/bkeepers/dotenv#usage).
You will need a .env.staging and .env.production file on the respective
targets. These files contain all sensitive information that does not
belong into a git repository. All other application settings are defined
as defaults in the normal `.env` that can be checked in to git. The
environment specific dotenv file ovverides settings in the default
dotenv file.

**The dotenv file should be present on first deployment**

# Seeds

We are using [sprig](http://vigetlabs.github.io/sprig/documentation.html) instead standard [rails seeds](http://edgeguides.rubyonrails.org/migrations.html#migrations-and-seed-data). We do this while they are easier to maintain and it is possible to separate seed data for different environments and even integrating relationships between records is also much easier.

Look in the [official documentation](http://vigetlabs.github.io/sprig/documentation.html#seed-data-files) for some examples.

# Possible issues you could ran into

You will probably run into the case that the field length validatio gem (valle)
will complain about some carrierwave fields. Carrierwave tricks a bit with the
uploaders. Anyway, you [can simply add the the upload attributes](https://github.com/kaize/valle#disabling-valle-on-specific-attributes) into
`config/initializers/valle.rb` and everything will work as expected.

# Foundation Setup

## Grid
### settings.css.sass

- set $rem-base to the wanted body font-size, e.g. 16px
- $base-font-size is per default 100%, this is the body-font-size and per default the browsers have 16px. If you want e.g. a body font-size of 18px, set the $body-font-size to 112.5.% and the $rem-base to 18px
- build the correct grid with the following variables: $row-width, $column-gutter, $total-columns

### ie8_grid.css.sass

- set the width of the row with the same size as $row-width in settings.css.sass
- set the correct margin of .row
- set the correct padding of .column

## Media Queries
In settings.css.sass, set the media queries, e.g. $small-range, $large-range with a EM value, not a PX value.
the media queries for this variables are ranges, with a "from" value and a "to" value.

For $small-range as example, the default range is (0em, 40em), this means a range from 0 to 640px with a body font-size of 16px. Because we define the font-size relative to the browser font-size, the media queries cannot be a px value, there must be relative to, so we define it in EM.
You can calculate the values with pxtoem.com

Not use REM!

## Headings

### settings.css.sass
set the heading variables, $h1-font-size - $h6-font-size, with the value you want for small screen.

### base.css.sass
in small/base.css.sass, the headings are set via the variables from settings.css.sass

in medium/base.css.sass and large/base.css.sass, the headings are initially set with the same variables, set here your font-size via rem-calc to the value you want.

## foundation CSS Modules

### setting.css.sass
When you start a project, only the most used foundation css modules are initialized. Search for "$include-html" variables, e.g. $include-html-accordion-classes and set the value to true for the module you want to use.
If the value is false, the css from this module are not included, for a sleeker css file.

## Foundation JS Modules

### application.js.coffee
When you starting a project, the following foundation modules are activated in the application.js:
- foundation
- foundation.dropdown
- foundation.topbar

Below, you have the other foundation modules commented, move them up if you want to use one. And initialize every module specific with the code below, e.g. $(document).foundation('orbit')

## Sass/CSS basics

### mixins
use the mixins, like rem-calc, every time without a starting +
Right: rem-calc(20)
Wrong: +rem-calc(20)

### rem-calc
use every time rem-calc, or em-calc if you want. Use the mixin to if you want e.g. 1rem, it is easier for other team members to understand the wanted px value in the mixin, instead of a direct rem value.
