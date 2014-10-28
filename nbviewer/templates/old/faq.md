{% extends "layout.html" %}

{% block body %}

<style>

.container{
    max-width:700px;
}

p {
    text-align:justify;
}

</style>

{% filter markdown(extensions=['headerid(level=3)','toc'], extension_configs= {'toc' : [('anchorlink', True)]}) %}

# Frequently Asked Questions

[TOC]

### Placeholder question.

And answer.

### More questions.

Yup.

{% endfilter %}
{% endblock %}
