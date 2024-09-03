'use client'
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";


export default function PaymentSuccess() {
    const router = useRouter();
    return <div className='mt-10 relative z-[10] overflow-hidden lg:px-20 lg:mx-20 md:px-10 md:mx-10 sm:px-5 sm:mx-5'>
        <Result
            status="success"
            title="Your order was placed sucessfully."
            subTitle="Please check your email for recipt and confirmation."
            extra={[
                <Button className="!bg-green-800" onClick={() => router.push('/')} type="primary" key="console">
                    Back to shopping
                </Button>,
            ]}
        />
    </div >
}