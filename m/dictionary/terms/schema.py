import graphene
from graphene import ObjectType, Schema, relay
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType

from .models import Term, Category, Tag


class TermNode(DjangoObjectType):
    class Meta:
        model = Term
        filter_fields = {'term':['exact', 'contains', 'startswith'],
                         'category__name':['exact', 'contains', 'startswith'],
                         'tags__name':['exact', 'contains', 'startswith']}
        interfaces = (relay.Node,)


class CategoryNode(DjangoObjectType):
    class Meta:
        model = Category
        filter_fields = {'name': ['exact', 'contains', 'startswith'], }
        interfaces = (relay.Node,)


class TagNode(DjangoObjectType):
    class Meta:
        model = Tag
        filter_fields = {'name':  ['exact', 'icontains', 'istartswith'], }
        interfaces = (relay.Node,)


class Query(ObjectType):
    Term = relay.Node.Field(TermNode)
    Terms = DjangoFilterConnectionField(TermNode)

    Category = relay.Node.Field(CategoryNode)
    Categories = DjangoFilterConnectionField(CategoryNode)

    Tag = relay.Node.Field(TagNode)
    Tags = DjangoFilterConnectionField(TagNode)


class TagInput(graphene.InputObjectType):
    name = graphene.String()

class TagInputUpdate(graphene.InputObjectType):
    name = graphene.String()
    newName = graphene.String()


class CategoryInput(graphene.InputObjectType):
    name = graphene.String()

class CategoryInputUpdate(graphene.InputObjectType):
    name = graphene.String()
    newName = graphene.String()


class TermInput(graphene.InputObjectType):
    term = graphene.String()
    category = graphene.Field(CategoryInput)
    tags = graphene.List(TagInput)

class TermInputUpdate(graphene.InputObjectType):
    term = graphene.String()
    new_term = graphene.String()
    category = graphene.Field(CategoryInputUpdate)
    tags = graphene.List(TagInputUpdate)


class CreateTerm(graphene.Mutation):
    term = graphene.Field(TermNode)

    class Arguments:
        term_data = TermInput(required=True)

    @staticmethod
    def mutate(root, info, term_data):

        if Term.objects.filter(term=term_data['term']).exists():
            print("Term exist")
            term = Term.objects.get(term=term_data['term'])
            return CreateTerm(term=term)
        else:

            if not Category.objects.filter(name=term_data['category']['name']).exists():
                c = Category(name=term_data['category']['name'])
                c.save()
            else:
                c=Category.objects.get(name=term_data['category']['name'])
            term = Term(term = term_data['term'], category =c)
            term.save()

            for t in term_data['tags']:
                if not Tag.objects.filter(name=t['name']).exists():
                    tag = Tag(name=t['name'])
                    tag.save()
                    term.tags.add(tag)
                else:
                    tag=Tag.objects.get(name=t['name'])
                    term.tags.add(tag)
            return CreateTerm(term=term)

class UpdateTerm(graphene.Mutation):
    term = graphene.Field(TermNode)

    class Arguments:
        term_data = TermInputUpdate(required=True)

    @staticmethod
    def mutate(root, info, term_data):
        if Term.objects.filter(term= term_data['term']).exists():
            Term.objects.filter(term=term_data['term']).update(term=term_data['new_term'])


class CreateCategory(graphene.Mutation):
    category = graphene.Field(CategoryNode)

    class Arguments:
        category_data = CategoryInput(required=True)

    @staticmethod
    def mutate(root, info, category_data):
        category = Category.objects.create(**category_data)
        return CreateCategory(category=category)

class UpdateCategory(graphene.Mutation):
    category = graphene.Field(CategoryNode)

    class Arguments:
        category_data = CategoryInputUpdate(required=True)

    @staticmethod
    def mutate(root, info, category_data):
        if Category.objects.filter(name= category_data['name']).exists():
            Category.objects.filter(name=category_data['name']).update(name=category_data['newName'])


class CreateTag(graphene.Mutation):
    tag = graphene.Field(TagNode)

    class Arguments:
        tag_data = TagInput(required=True)

    @staticmethod
    def mutate(root, info, tag_data):
        tag = Tag.objects.create(**tag_data)

        return CreateTag(tag=tag)


class UpdateTag(graphene.Mutation):
    tag = graphene.Field(TagNode)

    class Arguments:
        tag_data = TagInputUpdate(required=True)

    @staticmethod
    def mutate(root, info, tag_data):
        if Tag.objects.filter(name=tag_data['name']).exists():
            Tag.objects.filter(name=tag_data['name']).update(name=tag_data['newName'])


class MyMutations(graphene.ObjectType):
    create_category = CreateCategory.Field()
    create_tag = CreateTag.Field()
    create_term = CreateTerm.Field()
    update_category = UpdateCategory.Field()
    update_tag = UpdateTag.Field()
    update_term = UpdateTerm.Field()


schema = Schema(query=Query, mutation=MyMutations)
