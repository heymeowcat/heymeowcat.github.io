// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://heymeowcat.is-a.dev',
	build: {
		// The whole stylesheet is a few KB, so inline it. This removes the
		// render-blocking request and the 10 minute cache TTL on the asset.
		inlineStylesheets: 'always',
	},
});
