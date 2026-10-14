// Runs before the page paints so the saved light/dark theme shows with no flash.
const code = `(function(){try{var t=localStorage.getItem('it-portal-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.ptheme=t}catch(e){}})();`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
