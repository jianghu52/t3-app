import Head from "next/head";
import { ReactNode } from "react"

type Props = {
    tile:string,
    children:ReactNode
};

export const Layout = ({tile="T3 todo Example", children}:Props) => {
    return (
        <div>
            <Head>
                <title>{tile}</title>
            </Head>
            <header></header>
            <main className="flex flex-1 flex-col items-center justify-center p-4">
                {children}
            </main>
            <footer></footer>
        </div>

    );
}