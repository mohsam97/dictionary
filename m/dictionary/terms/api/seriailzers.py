from terms.models import Term,Category,Tag

from rest_framework.serializers import ModelSerializer



class TermSerializer(ModelSerializer):
    class Meta:
        model = Term
        fields = '__all__'

class CatrgorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'