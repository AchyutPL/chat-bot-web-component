import './App.css'
import './globals.css'
// import 'chat-bot-by-atp';
import '../../dist'

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { DialogTrigger } from '@radix-ui/react-dialog';

function App() {
    return (
        <>
            {/* <Dialog>
                <DialogTrigger asChild>
                    <div className='fixed bottom-20 right-32 cursor-pointer'>
                        <img className='h-14 w-14 object-cover rounded-full' src='https://png.pngtree.com/thumb_back/fh260/background/20230408/pngtree-robot-white-cute-robot-blue-light-background-image_2199825.jpg' />
                    </div>
                </DialogTrigger>
                <DialogContent className='p-0 max-w-3xl overflow-y-scroll max-h-screen'>
                </DialogContent>
            </Dialog> */}
            <atp-chat-bot />

            <h1>Vite + React</h1>
            <div className="card">
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>

        </>
    )
}

export default App
