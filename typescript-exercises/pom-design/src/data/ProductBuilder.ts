/**
 * ProductData represents an e-commerce product model.
 */
export interface ProductData {
    name: string;
    quantity: number;
    price?: number;
    category?: string;
}

/**
 * ProductBuilder implements the Builder Pattern for test data.
 *
 * Why Builder Pattern:
 * - Solves the "telescoping constructor" problem when an object has many fields.
 * - Provides a readable, fluent API to construct complex objects step by step.
 * - Allows tests to selectively customize only the fields they care about.
 */
export class ProductBuilder {
    private product: ProductData = {
        name: 'Cucumber',
        quantity: 1,
    };

    withName(name: string): this {
        this.product.name = name;
        return this;
    }

    withQuantity(quantity: number): this {
        this.product.quantity = quantity;
        return this;
    }

    withPrice(price: number): this {
        this.product.price = price;
        return this;
    }

    withCategory(category: string): this {
        this.product.category = category;
        return this;
    }

    build(): ProductData {
        return { ...this.product };
    }
}