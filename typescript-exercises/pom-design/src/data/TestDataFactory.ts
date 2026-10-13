import { ProductBuilder, ProductData } from './ProductBuilder';


export class TestDataFactory {

    static createDefaultProduct(): ProductData {
        return new ProductBuilder()
            .withName('Cucumber')
            .withQuantity(1)
            .withPrice(48)
            .withCategory('Vegetables')
            .build();
    }

    static createProduct(name: string, quantity: number = 1, price?: number): ProductData {
        const builder = new ProductBuilder()
            .withName(name)
            .withQuantity(quantity);

        if (price !== undefined) {
            builder.withPrice(price);
        }

        return builder.build();
    }

    static createCarrot(quantity: number = 1): ProductData {
        return new ProductBuilder()
            .withName('Carrot')
            .withQuantity(quantity)
            .withPrice(56)
            .withCategory('Vegetables')
            .build();
    }

    static createTomato(quantity: number = 1): ProductData {
        return new ProductBuilder()
            .withName('Tomato')
            .withQuantity(quantity)
            .withPrice(16)
            .withCategory('Vegetables')
            .build();
    }
}