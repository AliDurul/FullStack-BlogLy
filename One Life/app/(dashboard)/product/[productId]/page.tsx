
import { readProduct } from '@/lib/features/products/productAPI';
import ProductReview from '../components/ProductReview';

import TopPageNavigation from '@/app/components/TopPageNavigation';
import { Product } from '@/types/types';




const ProductReviewPage = async ({ params }: { params: { productId: string } }) => {

    const product: Product = await readProduct(params.productId)

    return (
        <>
            <TopPageNavigation />
            <ProductReview product={product} />
        </>

    )
}

export default ProductReviewPage