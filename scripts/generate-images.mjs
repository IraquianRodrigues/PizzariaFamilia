#!/usr/bin/env node
// Small utility to generate product images (test mode) using OpenAI Images API.
// Usage:
//   node scripts/generate-images.mjs trios
//   node scripts/generate-images.mjs pizzas

import fs from 'node:fs';
import path from 'node:path';

// Lazy load dotenv if present
try { await import('dotenv/config'); } catch { }

const args = process.argv.slice(2);
const mode = args.find(a => !a.startsWith('--')) || 'trios';
const outDir = path.resolve(process.cwd(), 'public', 'assets', 'generated');

/** Minimal list for test (does not alter existing images) */
const itemsByMode = {
    trios: [
        {
            id: 'trio-01',
            name: 'Trio 01',
            filename: 'trio-01-gen.png',
            promptHint:
                'pão brioche brilhante, hambúrguer bovino suculento, queijo cheddar derretendo, alface crespa verde, tomate e cebola roxa em anéis, picles aparentes, maionese artesanal; batata frita dourada em cestinha de metal; lata de refrigerante genérica vermelha sem logotipo; pote pequeno de ketchup ao lado',
            angle: 'ângulo de 45 graus, lente 50mm, foco no lanche com profundidade de campo suave',
            background: 'fundo de restaurante com bokeh âmbar quente',
            board: 'servido sobre tábua de madeira rústica'
        },
        {
            id: 'trio-02',
            name: 'Trio 02',
            filename: 'trio-02-gen.png',
            promptHint:
                'frango empanado crocante, queijo prato, alface americana fresca, maionese cremosa; batata frita crocante em cestinha de metal com guardanapo; lata de refrigerante genérica prata sem marca; raminho de alecrim decorativo e potinho de ketchup',
            angle: 'close-up a 35 graus, lente 35mm, destaque nas texturas do empanado',
            background: 'fundo desfocado com luzes amareladas estilo bistrô',
            board: 'prato de cerâmica branco sobre tábua de madeira escura'
        },
        {
            id: 'trio-03',
            name: 'Trio 03',
            filename: 'trio-03-gen.png',
            promptHint:
                'filé bovino grelhado com marcas de grelha, queijo mussarela derretido, salada simples com alface e cebola roxa; batata frita rústica grossa; lata de refrigerante genérica preta sem marca; molho barbecue em potinho de vidro',
            angle: 'composição em 3/4, lente 85mm para compressão leve, foco no sanduíche e batatas',
            background: 'fundo de madeira escura com bokeh frio (azul neutro)',
            board: 'tábua de nogueira com papel manteiga dobrado'
        },
    ],
};

let items = itemsByMode[mode] || itemsByMode.trios;

// Ensure output dir
fs.mkdirSync(outDir, { recursive: true });

const buildPrompt = (name, hint, angle, background, board) => {
    return [
        'Foto de estúdio, iluminação profissional balanceada, nitidez alta, estilo cardápio gastronômico.',
        background,
        angle,
        board,
        hint,
        'sem texto na imagem, sem marca registrada, aparência realista e apetitosa, cores fiéis, 4:3.'
    ].filter(Boolean).join(' ');
};

async function main() {
    console.log(`Mode: ${mode}`);
    // Build items depending on mode
    if (mode === 'pizzas') {
        // Parse pizza IDs/names from src/data/pizzas.ts
        const filePath = path.resolve(process.cwd(), 'src', 'data', 'pizzas.ts');
        const src = fs.readFileSync(filePath, 'utf8');
        const regex = /pizza(?:Sweet|PlusSpecial|Special)?\(\s*'([^']+)'\s*,\s*'([^']+)'/g;
        const parsed = [];
        let m;
        while ((m = regex.exec(src))) {
            const id = m[1];
            const name = m[2];
            // Detect type by nearby function name
            const near = src.slice(Math.max(0, m.index - 30), m.index + 30);
            const isSweet = /pizzaSweet\(/.test(near);
            parsed.push({ id, name, isSweet });
        }

        const angles = [
            'vista de cima (top-down), lente 35mm, composição centrada',
            'ângulo de 30 graus, lente 50mm, foco na borda crocante',
            'composição em 3/4, lente 85mm, foco no topping',
        ];
        const bgs = [
            'fundo de mesa de madeira clara com bokeh quente',
            'fundo de pedra escura com bokeh frio',
            'fundo de forno a lenha desfocado com luz âmbar',
        ];

        items = parsed.map((p, idx) => {
            const angle = angles[idx % angles.length];
            const background = bgs[(idx + 1) % bgs.length];
            const board = 'servida em forma de pizza sobre tábua de madeira com papel manteiga';
            const hint = p.isSweet
                ? `pizza doce sabor ${p.name.toLowerCase()}, cobertura generosa, brilho sutil de chocolate/açúcar, contraste de cores`
                : `pizza sabor ${p.name.toLowerCase()}, queijo derretido puxando, borda levemente tostada, toppings evidentes e azeitonas`;
            const prompt = [
                'Foto de estúdio, iluminação profissional balanceada, nitidez alta, estilo cardápio gastronômico.',
                background,
                angle,
                board,
                hint,
                'sem texto na imagem, sem marca registrada, aparência realista e apetitosa, cores fiéis, 4:3.'
            ].join(' ');
            return {
                id: p.id,
                name: p.name,
                outPath: path.resolve(process.cwd(), 'public', 'assets', 'pizzas', `${p.id}.jpg`),
                prompt,
                format: 'jpg',
            };
        });
    } else {
        // Default predefined (trios) -> normalize to common shape
        items = (itemsByMode[mode] || itemsByMode.trios).map((it) => ({
            id: it.id,
            name: it.name,
            outPath: path.join(outDir, it.filename),
            prompt: [
                'Foto de estúdio, iluminação profissional balanceada, nitidez alta, estilo cardápio gastronômico.',
                it.background,
                it.angle,
                it.board,
                it.promptHint,
                'sem texto na imagem, sem marca registrada, aparência realista e apetitosa, cores fiéis, 4:3.'
            ].filter(Boolean).join(' '),
            format: 'png',
        }));
    }
    // No dry-run mode: this script always generates files when executed.

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('OPENAI_API_KEY ausente. Crie um .env com OPENAI_API_KEY=...');
        process.exit(1);
    }

    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({ apiKey });

    let sharp;
    try { sharp = (await import('sharp')).default; } catch { }

    for (const it of items) {
        const prompt = it.prompt;
        console.log(`Gerando ${it.id} -> ${path.relative(process.cwd(), it.outPath)}`);
        try {
            const res = await client.images.generate({
                model: 'gpt-image-1',
                prompt,
                size: '1024x1024',
                // background: 'transparent', // opcional
                // quality: 'high', // opcional
            });
            const b64 = res.data?.[0]?.b64_json;
            if (!b64) throw new Error('Resposta sem b64_json');
            const buf = Buffer.from(b64, 'base64');
            const dir = path.dirname(it.outPath);
            fs.mkdirSync(dir, { recursive: true });
            if (it.format === 'jpg' && sharp) {
                const jpg = await sharp(buf).jpeg({ quality: 90 }).toBuffer();
                fs.writeFileSync(it.outPath, jpg);
            } else {
                fs.writeFileSync(it.outPath, buf);
            }
            console.log('✔ salvo em', path.relative(process.cwd(), it.outPath));
        } catch (err) {
            console.error(`✖ falha ao gerar ${it.id}:`, err?.message || err);
        }
    }
}

main();
