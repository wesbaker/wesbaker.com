---
layout: post
disqus: true
title: "OCRing a lot of PDFs"
date: 2020-07-18 17:42:00 -0400
---

First, some preamble: I very much enjoy RPGs and I'm always finding new ones and reading them to see if I want to run them. My kids are almost always willing subjects to try out systems as well. I recently decided that I want to use RPGs to help teach math and my kids have been running around the house playing Star Wars, so the old West End Games Star Wars D6 RPG seemed like a perfect choice. The GM sets a difficulty number and the players roll a number of D6s and add them up. It's not high math by any means, but by asking him to add several numbers and then compare to another value, it's doing something while keeping him engaged. Please be on the lookout for my TED talk.

Lets get back to PDFs though. These days you can generally get all RPGs in printed or PDF format. PDFs are cheaper and take up little to no room. Additionally, if you're interested in an older game--say a Star Wars RPG that was last published in 1998--you may only be able to get PDFs. With Star Wars, many of the PDFs can be easily found, but there's one problem: for the most part, they are not OCR'ed.

I spent some time digging around on the internet and the fastest approach that I could find was using something like PDFPenPro, but that was \$129 and I wasn't looking to spend that kind of money. So I dug around on [homebrew](https://brew.sh) and found [`ocrmypdf`](https://ocrmypdf.readthedocs.io/en/latest/#). Then I wrote a [fish shell](https://fishshell.com) one liner to OCR all of the PDFs:

```bash
for file in ./*.pdf; ocrmypdf "$file" "$file"; end
```

Run that and walk away as `ocrmypdf` does it's thing.
