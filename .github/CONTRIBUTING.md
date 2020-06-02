## Contribution Guidelines

Pick an existing issue, push a PR and become a beaming contributor!
Issues marked as [good first issue](https://github.com/dot-cafe/beam.cafe/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) which are not that hard and can be easily fixed / implemented (if feature).

Before you create a PR or issue please take a look at the [README](https://github.com/ovanta/vue-cloudfront/blob/master/README.md)

While writing issues / making PRs, please be as specific as possible.

## Setup
You'll need to clone / fork both [beam.cafe](https://github.com/dot-cafe/beam.cafe) (the frontend) and [beam.cafe.backend](https://github.com/dot-cafe/beam.cafe.backend),
install them on your local machine and start both dev-servers with `npm run dev`.

**The master branch is always the production branch!**

### Issue checklist

 1. [Use the search](https://github.com/dot-cafe/beam.cafesearch?type=Issues), maybe there is already an answer or a PR.
 2. If not found, [create an issue](https://github.com/dot-cafe/beam.cafe/issues/new), please don't forget to carefully describe how to reproduce it / pay attention to the issue-template.

### Pull request checklist

 1. Before a PR run both `npm run lint:fix` and `npm run build` and resolve remaining issues.
 2. Please take care about basic commit message conventions, see [Writing Good Commit Messages](https://github.com/erlang/otp/wiki/writing-good-commit-messages).
 3. Each _feature_ must have its own branch! Bug-fixes only the corresponding branch (master is fine in this case)
 4. Reference any relevant issues / PRs in your PR.

There is no test-suite (yet) so every feature has to be carefully implemented :)
