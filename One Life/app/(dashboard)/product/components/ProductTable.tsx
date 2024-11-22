import { updateProductState } from '@/lib/features/products/productSlice';
import { useAppDispatch } from '@/lib/hooks';
import { Product, ProductTableProp } from '@/types/types';
import { truncateText } from '@/utils/helperFunctions';
import { useRouter } from 'next/navigation';
import React from 'react'

const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL;


const ProductTable = ({ filteredItems, editProduct, deleteProduct}: ProductTableProp) => {

    const router = useRouter()
    const dispatch = useAppDispatch()

    return (
        <div className="panel mt-5 overflow-hidden border-0 p-0">
            <div className="table-responsive">
                <table className="table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Is Public</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th className="!text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((product: Product) => {
                            return (
                                <tr key={product.id} className='cursor-pointer' onClick={() => { router.push(`/product/${product.id}`), dispatch(updateProductState(product)) }} >
                                    <td>
                                        <div className="flex w-max items-center">
                                            {product.thumb && (
                                                <div className="w-max">
                                                    <img src={IMG_URL + product.thumb} className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2" alt="avatar" />
                                                </div>
                                            )}
                                            {!product.thumb && product.name && (
                                                <div className="grid h-8 w-8 place-content-center rounded-full bg-primary text-sm font-semibold text-white ltr:mr-2 rtl:ml-2"></div>
                                            )}
                                            {!product.thumb && !product.name && (
                                                <div className="rounded-full border border-gray-300 p-2 ltr:mr-2 rtl:ml-2 dark:border-gray-800">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                        <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div>{product.name}</div>
                                        </div>
                                    </td>
                                    <td>{product.is_pub ? "YES" : "NO"}</td>
                                    <td>{truncateText(product.description, 29)}</td>
                                    <td className="whitespace-nowrap">{product?.category.title}</td>
                                    {/* @ts-ignore */}
                                    <td className="whitespace-nowrap">K{product.price.toLocaleString('en-ZM', { style: 'currency', currency: 'ZMW' })}</td>
                                    <td>
                                        <div className="flex items-center justify-center gap-4">
                                            <button type="button" className="btn btn-sm btn-outline-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // This will stop the event from bubbling up
                                                    editProduct(product);
                                                }}>
                                                Edit
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteProduct(product.id);
                                                }}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductTable