+++
title = "dewey"
description = "A Discord bot that facilitates book club logistics — randomizing book pickers and sending reminders for book selection and meeting scheduling."
weight = 1
date = 2024-01-01

[extra]
tags = ["typescript", "discord", "raspberry-pi"]
local_image = "dewey/pick.png"
+++

A Discord bot for managing a book club rotation. Randomizes who picks the book each month, tracks book picks with Goodreads integration, and sends mid-month reminders.

{{ figure(path="/projects/dewey/pick.png", alt="/pick command", caption="The `/pick` command lets the book chooser pick their book or the admin to set a book for someone else.") }}

{{ figure(path="/projects/dewey/reminder.png", alt="Monthly reminder message", caption="Every month a reminder is sent to the current chooser and next month's as well.") }}

{{ figure(path="/projects/dewey/schedule.png", alt="/schedule command", caption="The `/schedule` command shows the upcoming schedule along with anyone who's been pinned to a specific month.") }}
