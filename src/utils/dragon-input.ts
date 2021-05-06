const DragonInput = {
  install(Vue: any, options: any) {

    (window as any).DRAGON_INPUTS = {};
    (window as any).DRAGON_INPUT_INTERVALS = {};

    Vue.mixin({
      mounted() {
        // if (window.localStorage.getItem('dragon-plugin-installed') && window.localStorage.getItem('dragon-plugin-installed') === '1') {
        //   console.warn('Using Dragon Input plugin!');
        const x = document.getElementsByTagName("INPUT");
        if (x) {
          Array.from(x).forEach((e: Element) => {
            if ((e as HTMLInputElement).type.toLowerCase() === "text") {
              if (!e.hasAttribute('data-dragon-random')) {

                const aa = String(Math.random() * (new Date()).getTime());
                e.setAttribute('data-dragon-random', aa);

                e.addEventListener('focus', (x) => {
                  if (x.target) {

                    const did = (x.target as HTMLInputElement).getAttribute('data-dragon-random') as string;
                    (window as any).DRAGON_INPUTS[did] = (e as HTMLInputElement).value;

                    (window as any).DRAGON_INPUT_INTERVALS[did] = setInterval(() => {
                      if ((window as any).DRAGON_INPUTS[did] !== (e as HTMLInputElement).value) {
                        (window as any).DRAGON_INPUTS[did] = (e as HTMLInputElement).value;

                        const evt = document.createEvent("HTMLEvents");
                        evt.initEvent("input", false, true);
                        (e as HTMLInputElement).dispatchEvent(evt);
                      }
                    }, 50);

                  }
                });

                e.addEventListener('blur', (x) => {
                  if (x.target) {
                    const did = (x.target as HTMLInputElement).getAttribute('data-dragon-random') as string;
                    clearInterval((window as any).DRAGON_INPUT_INTERVALS[did]);
                  }
                })
              }
            }
          });
        }
        // }
      }
    });

  }
};

export default DragonInput;
