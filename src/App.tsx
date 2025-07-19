import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMicrophone} from "@fortawesome/free-solid-svg-icons";

export default function App() {

  return (
    <div className="bg-white">
      <main>
        <div className="relative isolate overflow-hidden bg-gray-900 pt-14 pb-16 sm:pb-20 h-screen">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-50">
              <div className="text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                  Check your speaking skills!
                </h1>
                <div className="mt-8 flex items-center justify-center gap-x-6">
                  <a href="#"
                     className="rounded-full bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
                    <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "40px"}}/>
                  </a>
                </div>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt
                  amet
                  fugiat veniam occaecat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
