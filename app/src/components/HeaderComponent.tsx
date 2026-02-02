
interface HeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

function HeaderComp(props: HeaderProps)
{
    const {title, subtitle, children} = props;
    
    return (
    <header className="fixed top-0 left-0 right-0 w-screen border-b-2 border-[var(--color-primary)] px-4 lg:px-8 py-6 z-50 bg-[var(--bg-color)] backdrop-blur-md bg-opacity-95 rounded-2xl">
        <div className="max-w-full mx-auto">
            <div className="text-center mb-4">
                <h1 className="pokemon-font-large font-bold">
                    {title}
                </h1>
                {subtitle && (
                    <p className="pokemon-font text-sm">
                        {subtitle}
                    </p>
                )}
            </div>
            
            {children && (
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    {children}
                </div>
            )}
        </div>
    </header>
        
    )
}

export default HeaderComp;