import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingType,ListingTypeSchema } from 'src/schemas/listingtype.schema';
import { Category,CategorySchema } from 'src/schemas/category.schema';
@Module({
  imports:[MongooseModule.forFeatureAsync([{
    name:ListingType.name,
    useFactory: () => {
    const schema = ListingTypeSchema;
    schema.pre('save', async function () {
      if (this.name && this.isModified('name')) {
        this.slug = this.name.toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      }
    });
    return schema;
  }},{
    name:Category.name,
    useFactory: () => {
      const schema = CategorySchema;
      return schema;
    }
  }
])],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
