import React from 'react'
import Link from 'next/link';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/app/icons';
import { Product, ProductTableProp } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { updateProductState } from '@/lib/features/products/productSlice';

const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL;


const ProductGrid = ({ filteredItems, editProduct, deleteProduct, }: ProductTableProp) => {

    const router = useRouter()
    const dispatch = useAppDispatch()
    return (
        <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredItems.map((product: Product) => {
                return (
                    <div className={`relative overflow-hidden rounded-md bg-white text-center shadow-lg ${product.is_pub ? 'shadow-green-300' : 'shadow-red-300'}  dark:bg-[#1c232f] group transition`} key={product.id}>
                        <div className={`relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]`}>
                            <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-4 ">
                                <img className="mx-auto max-h-40 w-4/5 object-contain group-hover:scale-110 transition duration-300" src={IMG_URL + product.thumb} alt="product" />
                            </div>
                            <div className="relative mt-3 px-6 pb-5">
                                <div className="text-xl">{product?.name}</div>
                                <div className="text-white-dark">{product?.category?.title}</div>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex-auto">
                                        <div className="text-info">43343</div>
                                        <div>Sold Times</div>
                                    </div>
                                    <div className="flex-auto">
                                        <div className="text-info">66</div>
                                        <div>Issueed</div>
                                    </div>
                                    <div className="flex-auto">
                                        <div className="text-info">K{product.price}</div>
                                        <div>Price</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-10 -right-11 group-hover:right-0  p-2 flex flex-col items-center justify-center gap-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button className='flex justify-center items-center  w-10 h-w-10 bg hover:text-red-700' onClick={() => deleteProduct(product.id)}>
                                <DeleteIcon />
                            </button>
                            <button className="flex justify-center items-center  w-10 h-w-10 hover:text-primary" onClick={() => { router.push(`/product/${product.id}`), dispatch(updateProductState(product)) }}>
                                <PreviewIcon />
                            </button>
                            <button className="flex justify-center items-center  w-10 h-w-10 hover:text-primary" onClick={() => editProduct(product)}>
                                <EditIcon />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default ProductGrid