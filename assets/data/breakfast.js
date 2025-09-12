import idli from '../images/idli.jpg'
import dosa from '../images/Dosa.jpg'
import upma from '../images/upma.jpg'
import semiya from '../images/semiya.jpg'
import poori from '../images/poori.jpg'
import pongal from '../images/pongal.jpg'



export const images = {
    idli,
    dosa,
    upma,
    semiya,
    pongal,
    poori
}


export const food = [
    {
        id: 1,
        Title: 'Idli',
        Image: images.idli,
        Ingredients: [
            '1. - Parboiled Rice (Idli Rice) – 2 cups',
            '2. - Urad Dal (Split Black Gram) – ½ cup',
            '3. - Fenugreek Seeds (Methi) – ¼ to 1 tablespoon',
            '4. - Poha (Flattened Rice) – 2 to 3 tablespoons',
            '5. - Salt',
            '6. - Water'
        ],
        How_to: [
            '1. - Soak rice, dal, fenugreek seeds, and poha separately for 4–6 hours',
            '2. - Grind dal and fenugreek to a smooth, fluffy paste',
            '3. - Grind rice and poha to a slightly coarse paste',
            '4. - Mix both batters, add salt, and ferment overnight',
            '5. - Steam in greased idli moulds for 10–15 minutes',
            '6. - Your Idli is Done...'
        ]
    },
    {
        id: 2,
        Title: 'Dosa',
        Image: images.dosa,
        Ingredients: [
            '1. - Parboiled Rice – 2 cups',
            '2. - Urad Dal – ½ cup',
            '3. - Fenugreek Seeds – ½ tsp',
            '4. - Poha – 2 tbsp',
            '5. - Salt',
            '6. - Water'
        ],
        How_to: [
            '1. - Soak rice, dal, fenugreek seeds, and poha for 4–6 hours',
            '2. - Grind dal and poha to a smooth paste',
            '3. - Grind rice to a slightly coarse paste',
            '4. - Mix both batters, add salt, and ferment overnight',
            '5. - Heat a tawa, pour batter, and spread in circular motion',
            '6. - Drizzle oil, cook until golden and crisp',
            '7. - Your Dosa is Ready...'
        ]
    },
    {
        id: 3,
        Title: 'Upma',
        Image: images.upma,
        Ingredients: [
            '1. - Rava (Semolina) – 1 cup',
            '2. - Oil – 2 tbsp',
            '3. - Mustard Seeds – ½ tsp',
            '4. - Urad Dal – 1 tsp',
            '5. - Chana Dal – 1 tsp',
            '6. - Curry Leaves – 1 sprig',
            '7. - Green Chili – 2 (chopped)',
            '8. - Ginger – ½ inch (grated)',
            '9. - Onion – 1 (chopped)',
            '10. - Water – 2½ to 3 cups',
            '11. - Salt – to taste'
        ],
        How_to: [
            '1. - Dry roast rava until aromatic, set aside',
            '2. - Heat oil, add mustard, urad dal, chana dal, curry leaves, chili, and ginger',
            '3. - Add onions and sauté until translucent',
            '4. - Pour water, add salt, bring to boil',
            '5. - Slowly add rava while stirring to avoid lumps',
            '6. - Cover and cook for 2–3 minutes',
            '7. - Fluff and serve hot...'
        ]
    },
    {
        id: 4,
        Title: 'Semiya',
        Image: images.semiya,
        Ingredients: [
            '1. - Vermicelli – 1 cup',
            '2. - Oil – 1½ tbsp',
            '3. - Mustard Seeds – ¼ tsp',
            '4. - Cumin Seeds – ½ tsp',
            '5. - Urad Dal – 1 tsp',
            '6. - Chana Dal – 1 tsp',
            '7. - Curry Leaves – 1 sprig',
            '8. - Green Chili – 1 (chopped)',
            '9. - Onion – 1 (chopped)',
            '10. - Water – 1½ cups',
            '11. - Salt – to taste'
        ],
        How_to: [
            '1. - Roast vermicelli until golden, set aside',
            '2. - Heat oil, add mustard, cumin, dals, curry leaves, chili, and onion',
            '3. - Sauté until onions are soft',
            '4. - Add water and salt, bring to boil',
            '5. - Add vermicelli, stir well',
            '6. - Cook until water is absorbed',
            '7. - Rest for 5 mins, fluff and serve...'
        ]
    },
    {
        id: 5,
        Title: 'Poori',
        Image: images.poori,
        Ingredients: [
            '1. - Wheat Flour – 2 cups',
            '2. - Semolina – 1 tbsp',
            '3. - Salt – ½ tsp',
            '4. - Oil – 2 tsp (for dough)',
            '5. - Water – as needed',
            '6. - Oil – for deep frying'
        ],
        How_to: [
            '1. - Mix flour, semolina, salt, and oil',
            '2. - Add water gradually to make a stiff dough',
            '3. - Rest dough for 10 mins, divide into balls',
            '4. - Roll into small discs',
            '5. - Heat oil, fry poori until puffed and golden',
            '6. - Drain and serve hot...'
        ]
    },
    {
        id: 6,
        Title: 'Pongal',
        Image: images.pongal,
        Ingredients: [
            '1. - Raw Rice – ½ cup',
            '2. - Moong Dal – ½ cup',
            '3. - Ghee – 2 tbsp',
            '4. - Cumin Seeds – ½ tsp',
            '5. - Peppercorns – ½ tsp',
            '6. - Ginger – ½ inch (grated)',
            '7. - Curry Leaves – few',
            '8. - Cashews – 10',
            '9. - Salt – to taste',
            '10. - Water – 3 cups'
        ],
        How_to: [
            '1. - Dry roast moong dal until aromatic',
            '2. - Wash rice and dal, pressure cook with water and salt for 3–4 whistles',
            '3. - Heat ghee, add cumin, pepper, ginger, curry leaves, and cashews',
            '4. - Pour tempering into cooked rice-dal mixture',
            '5. - Mix well and simmer for 2 mins',
            '6. - Serve hot with chutney or sambar...'
        ]
    }
]