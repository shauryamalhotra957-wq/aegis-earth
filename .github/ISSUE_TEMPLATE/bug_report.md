name: Bug Report
description: Report a bug or rendering issue in Aegis Earth
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: Thank you for helping improve Aegis Earth!
  - type: input
    id: browser
    attributes:
      label: Browser & OS
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: Detailed summary of what went wrong.
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
    validations:
      required: true
