# NewScraper Core Module

[![npm version](https://badge.fury.io/js/news-scraper-core.svg)](https://badge.fury.io/js/news-scraper-core) [![npm dependencies](https://david-dm.org/stewiekillsloiss/news-scraper-core.svg)](https://david-dm.org/stewiekillsloiss/news-scraper-core)



> The core module for the NewScraper
> [https://github.com/XOP/news-scraper](https://github.com/XOP/news-scraper)



## Goal

**NewScraper Core Module** (NewScraper) is a NodeJS module, that receives specific directives as props and returns scraped pages data.

Both directives' and output' format is `JSON`.

NewScraper is designed to be used as a **middleware** for a server / hybrid / CLI application.



## API

### Config

> todo


### Input

Input is the collection of directives in a `JSON` format.

> It is recommended for the application to store directives in a most readable format (e.g. `YAML`) and convert it on the fly to the `JSON`.

Example:

```
[
    {
        "title": "Smashing magazine",
        "url": "http://www.smashingmagazine.com/",
        "elem": "article.post",
        "link": "h2 > a",
        "author": "h2 + ul li.a a",
        "time": "h2 + ul li.rd",
        "image": "figure > a > img",
        "limit": 6
    },
    {...},
    {...}
]
```

`title`  
name of the resource, **required**

`url`  
url of the resource, **required**

`elem`  
CSS selector of the news item container element, **required**

`link`  
CSS selector of the link (<a href="">...</a>) _inside_ of the `elem`
If the `elem` itself _is_ a link, this is not required

`author`  
CSS selector of the author element _inside_ of the `elem`

`time`  
CSS selector of the time element _inside_ of the `elem`

`image`  
CSS selector of the image element _inside_ of the `elem`
This one can be `img` tag or any other - NewScraper will search for `data-src` and `background-image` CSS properties to find proper image data

`limit`  
how many `elem`-s from the `url` will be scraped, maximum


### Output

Output includes all Input data  
`pages -> [] -> {...}`

**Plus** the parsed scraping result, ready for the favourite templating engine  
`pages -> [] -> {data -> [] -> {...}}`

**Plus** the unmodified markup from the specified pages  
`pages -> [] -> {data -> [] -> {raw}}`


It also contains some **meta-data**, such as path to the current data file and the exact moment of the scraping start.

Example:

```
{
    "meta": {
        "file": "/Users/[...]/data/1474811135645.json",
        "date": 1474811135645
    },
    "pages": [
        {
            "url": "https://www.smashingmagazine.com",
            "elem": "article.post",
            "link": "h2 > a",
            "author": "h2 + ul li.a a",
            "time": "h2 + ul li.rd",
            "image": "figure > a > img",
            "limit": 6,
            "data": [
                {
                "href": "https://www.smashingmagazine.com/2016/09/interview-with-matan-stauber/",
                "text": "\n\t\t\tAn Interview With Matan Stauber\n\t\t\tStretching The Limits Of What’s Possible\n\t\t",
                "title": "Read 'Stretching The Limits Of What’s Possible'",
                "raw": "<article class=\"post-266432 post type-post status-publish format-standard has-post-thumbnail hentry category-general tag-interviews\" vocab=\"http://schema.org/\" typeof=\"TechArticle\"> [ ... a lot of markup ... ] </article>",
                "author": "Cosima Mielke",
                "time": "September 23rd, 2016",
                "imageSrc": "https://www.smashingmagazine.com/wp-content/uploads/2016/09/histography-website-small-opt.png"
                },
                {... x5}
            ]
        },
        {...},
        {...}
    ]
```



## [MIT License](LICENSE)
