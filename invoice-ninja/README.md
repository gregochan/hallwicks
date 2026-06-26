# Hallwicks Invoice Ninja Quote Format

This folder contains a first-pass custom quotation format for Invoice Ninja v5 based on the provided Hallwicks PDF samples.

## Best Fit

Use `hallwicks-quote-template.html` as an Invoice Ninja **Template** or template-style custom design. It uses Invoice Ninja's Twig support to group line items into sections and calculate section subtotals.

Official docs checked:

- https://invoiceninja.github.io/docs/advanced-topics/custom-fields
- https://invoiceninja.github.io/docs/advanced-topics/templates

## Data Entry Convention

For each quote line item:

- `Product Key`: item code, for example `A1.`, `C2`, `F4.`
- `Description`: the Chinese/English item description. Use line breaks for continuation lines.
- `Quantity`: numeric quantity, for example `1`, `4.8`, `35`
- `Unit Cost`: numeric unit rate, for example `4200`
- `Product Custom Value 1`: section, for example `A. 初步工程`
- `Product Custom Value 2`: optional subsection heading, for example `前台/及等侯間/通道`
- `Product Custom Value 3`: unit label, for example `job`, `項`, `直米`, `平方米`

For the quote itself:

- `Custom Value 1`: attention line, for example `Mr. Ko`
- `Custom Value 2`: `Re:` subject line
- `Custom Value 4`: optional signature/stamp image URL
- `Terms`: period of construction and payment schedule
- `Public Notes`: exclusions/remarks

## Install In Invoice Ninja

1. Open Invoice Ninja admin.
2. Go to `Settings > Invoice Design > Custom Designs > New Design`.
3. Choose the template option if available, then enable the `Quote` data type.
4. Paste `hallwicks-quote-template.html` into the template/body editor.
5. Preview against a real quote.
6. Make sure the quote currency is HKD.

If your Invoice Ninja screen only exposes regular custom-design tabs, copy the CSS from the `<style id="style">` block into `Includes`, and the `<ninja>...</ninja>` body into `Body`.

## Notes

- Quotes with more than three sections automatically get a separate summary/signature page, matching `HCL-Q-1004r1.pdf`.
- Short quotes keep terms, notes, and signature together after the total, matching `HCL-Q-1005.pdf`.
- If Chinese glyphs do not render on the hosting provider, configure Invoice Ninja to use a CJK-capable font such as Noto Sans CJK TC.
