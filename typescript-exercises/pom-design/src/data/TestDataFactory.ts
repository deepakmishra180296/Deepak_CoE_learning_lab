import { ProductBuilder, ProductData } from './ProductBuilder';

/**
 * TestDataFactory implements the Factory Pattern for the e-commerce test suite.
 *
 * Why Factory Pattern:
 * - Centralizes test data creation in one place.
 * - Provides sensible defaults for common test scenarios.
 * - Hides the complexity of object creation from individual test specs.
 * - Combines with the Builder pattern under the hood to assemble complex test objects.
 */
export class TestDataFactory {
    /**
     * Factory method: Returns standard default product ('Cucumber', qty: 1)
     */
    static createDefaultProduct(): ProductData {
        return new ProductBuilder()
            .withName('Cucumber')
            .withQuantity(1)
            .withPrice(48)
            .withCategory('Vegetables')
            .build();
    }

    /**
     * Factory method: Creates a custom product by name and quantity
     */
    static createProduct(name: string, quantity: number = 1, price?: number): ProductData {
        const builder = new ProductBuilder()
            .withName(name)
            .withQuantity(quantity);

        if (price !== undefined) {
            builder.withPrice(price);
        }

        return builder.build();
    }

    /**
     * Factory method: Preset for Carrot item
     */
    static createCarrot(quantity: number = 1): ProductData {
        return new ProductBuilder()
            .withName('Carrot')
            .withQuantity(quantity)
            .withPrice(56)
            .withCategory('Vegetables')
            .build();
    }

    /**
     * Factory method: Preset for Tomato item
     */
    static createTomato(quantity: number = 1): ProductData {
        return new ProductBuilder()
            .withName('Tomato')
            .withQuantity(quantity)
            .withPrice(16)
            .withCategory('Vegetables')
            .build();
    }
}