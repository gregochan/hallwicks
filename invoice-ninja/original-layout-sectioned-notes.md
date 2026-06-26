# Section Grouping In Invoice Ninja

Use the two files in this folder to update the existing Invoice Ninja design while keeping the current Plain/Roboto layout:

- `original-layout-sectioned-body.html` -> paste into the design `Body` tab.
- `original-layout-sectioned-includes.css` -> paste into the design `Includes` tab.

The same design works for both quotes and invoices because the Twig block checks for `quotes` first, then `invoices`.

## Line Item Setup

For each quote or invoice line:

- `Product Key`: item code, such as `A1.`, `B4.`, `C2.`
- `Description`: item description, with line breaks if needed
- `Quantity`: numeric quantity
- `Unit Cost`: numeric unit cost
- `Product Custom Value 1`: section name, such as `A. 清拆工程`
- `Product Custom Value 2`: optional subsection, such as `前台/及等侯間/通道`
- `Product Custom Value 3`: unit label, such as `job`, `項`, `直米`, `平方米`

For the quote/invoice itself:

- `Custom Value 1`: attention line
- `Custom Value 2`: `Re:` subject line

If you want cleaner labels in the Invoice Ninja line-item editor, set product custom field labels to:

- Product custom 1: `Section`
- Product custom 2: `Subsection`
- Product custom 3: `Unit`
