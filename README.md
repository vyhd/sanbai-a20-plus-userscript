# What is this?

This suppresses A3 content from being shown in the "difficulty tier" pages in Sanbai Ice Cream, e.g.
[Level 14 Single Play Difficulty](https://3icecream.com/difficulty_list/14). I wrote it to continue
tracking difficulty lamp progress on A20 PLUS, and I figured others would want to as well.

# How to use

Download a [UserScript](https://en.wikipedia.org/wiki/Userscript) manager for your browser, then import `script.js` into it.

# Contributions

Contributions are welcome! I don't have grand ambitions with this script, but if you do, you're welcome to file issues and/or send pull requests** and/or fork.

** *Pull request acceptance not guaranteed, so please check in with me via an issue or Discord ("vyhd") if you plan to spend significant time on one.*

# Changelog

### 2.1.3 (2023/11/18)
fix a rare edge case where we would error out if all song jackets are ranked (i.e., none are filed under 'Insufficient Data')

### 2.1.2 (2023/09/28)
correctly remove challenge charts for シル・ヴ・プレジデント and なだめスかし Negotiation (contributed by [@aanguyen](https://github.com/aanguyen) - thanks!)

### 2.1.1 (2023/08/04)
added Golden League A3 chart revocations for Draw the Savage and (tentatively) Going Hypersonic/MUTEKI BUFFALO

### 2.1.0 (2023/07/16)
added button to enable toggling A3 content on demand (contributed by [@robert-vo](https://github.com/robert-vo) - thanks!)

### 2.0.0 (2023/07/14)
moved from a Gist to a proper GitHub repo! _Please re-sync your script with the updated @updateURL/@downloadURL directives to continue getting updates._

### 1.0.3 (2023/07/14)
caught up on Golden League A3 chart revocations

### 1.0.2 (2023/04/10)
explicitly added CC0 license - author intends that to apply to 0.9.0 thru 1.0.2

### 1.0.1 (2023/04/04)
unsuppress KAC exclusive (since at least some MDX:U players can play it)

### 1.0.0 (2023/04/03)
declared this Good Enough For Release™

### 0.9.3 (2023/04/03)
Suppress KAC exclusive, fixed a couple missing songs from below

### 0.9.2 (2023/04/03)
Added gist URL, suppress A3 challenge charts/Asia licenses/gold cab exclusives

### 0.9.1 (2023/04/02)
Fixed GOLDEN LEAGUE Challenge charts from A3 still appearing

### 0.9.0 (2023/04/02)
Initially released version
