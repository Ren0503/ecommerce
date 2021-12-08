from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Category)
admin.site.register(Business)
admin.site.register(Product)
admin.site.register(ProductComment)
admin.site.register(ProductImage)
admin.site.register(Wish)
admin.site.register(Cart)
admin.site.register(RequestCart)
