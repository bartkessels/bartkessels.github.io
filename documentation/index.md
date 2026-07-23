# Documentation

This folder contains all the documentation for the Update Manager project.

The documentation is structured using the [Diataxis Framework](https://diataxis.fr).

## Contents

1. [Tutorials](./01-tutorials/index.md): A tutorial is an __experience__ that takes place under the guidance of a tutor. A tutorial is always __learning-oriented__ [(Daniele Procida, n.d.)](https://diataxis.fr/tutorials/).
2. [How-to-guids](./02-how-to-guides/index.md): How-to guides are __directions__ that guide the reader through a problem or towards a result. How-to guides are __goal-oriented__ [(Daniele Procida, n.d.)](https://diataxis.fr/how-to-guides/).
3. [Explanation](./03-explanation/index.md): Explanation is a discursive treatment of a subject, that permits reflection. Explanation is __understanding-oriented__ [(Daniele Procida, n.d.)](https://diataxis.fr/explanation/).
4. [Reference](./04-reference/index.md): Reference guides are __technical descriptions__ of the machinery and how to operate it. Reference material is __information-oriented__ [(Daniele Procida, n.d.)](https://diataxis.fr/reference/).

> The explanations for each chapter are directly taken from the Diataxis framework website.

## Structure

The documentation is structured using the Diataxis framework in order to keep an overview of which information goes where. To keep the documents within each section clean as well, each specific item must go in it's own folder with an `index.md` file to explain the subject.

### Example

For example, if we want to create a tutorial on how to setup this initial project, the folder structure would look like this.

```text
documentation/
|- 01-tutorials/
|  |- 01-initial-setup/
|    |- index.md
```

The `index.md` file of the `01-tutorials` section will get a new link that points to the `index.md` file of the `01-initial-setup` section. An example for such an addition could look like this

```markdown
# Tutorials

// <redacted>

## Contents

1. [Initial setup](./01-initial-setup/index.md): Follow this when you're new to the project and need to setup the environment from scratch.
```

Because a new folder `01-initial-setup/` is created, different files can be added so the `index.md` of the initial setup subject isn't clutered with information that's required, but can be put into different documents that can be references or linked to from the `index.md` file. This keeps the overall document structure clean while also allowing different subjects to have various files if required.