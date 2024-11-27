from django import template

register = template.Library()


@register.filter
def truncate_words(value, num_words=13):
    words = value.split()
    return ' '.join(words[:num_words]) + ('...' if len(words) > num_words else '')
