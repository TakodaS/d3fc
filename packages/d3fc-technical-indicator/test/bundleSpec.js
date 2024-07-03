import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

describe('bundle', function() {
    it('should corectly wire-up all the dependencies via their UMD-exposed globals', function(done) {
    
        const virtualConsole = new VirtualConsole().sendTo({
            error: done
        });
        const dom = new JSDOM('<html></html>', { virtualConsole, runScripts: 'dangerously' });

        const { window } = dom;

        const loadScript = (filePath) => {
            const scriptContent = fs
                .readFileSync(filePath, 'utf-8');   
            const scriptElement = window.document.createElement('script');
            scriptElement.textContent = scriptContent;
            window.document.head.appendChild(scriptElement);
        };

    
        const scripts = [  require.resolve('d3/dist/d3.js'),
            require.resolve('../../../node_modules/@d3fc/d3fc-rebind/build/d3fc-rebind.js'),
            require.resolve('../build/d3fc-technical-indicator.js')
        ];

        scripts.forEach(loadScript);

        window.onload = () => {
            try {
                const indicator = window.fc.indicatorMovingAverage();
                const data = [0, 1, 6, 4, 8];
                const transformed = indicator(data);
                expect(transformed).not.toBeUndefined();
                done();
            } catch (err) {
                done(err);
            }
        };
    });
});
