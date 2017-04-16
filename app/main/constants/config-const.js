'use strict';

angular.module('main')
  .constant('Config', {
    ENV: {
        /*inject-env*/
        'SERVER_URL': 'https://skillicookingdevapi.info/api/',
    'CHANNEL': 'dev',
    'API_PASSWORD': 'MDm|C7oQQIm&AZyhx4g7m^+uNGqm$7Ctt2-60O&Ek-%0o!NuLT'
        /*endinject*/
    },
    BUILD : {
        /*inject-build*/
        /*endinject*/
    }
  })
  .constant('COMPATIBILITY', {
    'VERSION': 4
  })
  .constant('NAME_FORM_FLAGS', {
    'SINGULAR': 'singularForm',
    'STANDARD': 'standardForm',
    'PLURAL': 'pluralForm'
  })
  .constant('STEP_TYPES', {
    'BAKE': 'Bake',
    'BOIL': 'Boil',
    'BRINGTOBOIL': 'BringToBoil',
    'BREAKEGG': 'BreakEgg',
    'COOK': 'Cook',
    'CUSTOM': 'Custom',
    'CUT': 'Cut',
    'DRY': 'Dry',
    'EQUIPMENTPREP': 'EquipmentPrep',
    'HEAT': 'Heat',
    'MOVE': 'Move',
    'PLACE': 'Place',
    'PREHEAT': 'PreheatOven',
    'REDUCEHEAT': 'ReduceHeat',
    'REMOVE': 'Remove',
    'SAUTEE': 'Saute',
    'SEASON': 'Season',
    'SERVE': 'Serve',
    'SLOWCOOK': 'SlowCook',
    'STEAM': 'Steam',
    'STIR': 'Stir'
  }).constant('CUT_STEP_NAMES', {
    'DICE' : 'Dice',
    'DICED' : 'Diced',
    'CUT' : 'Cut',
    'CHOP' : 'Chop',
    'CHOPPED' : 'Chopped',
    'SLICE' : 'Slice',
    'SLICED' : 'Sliced',
    'MINCE' : 'Mince',
    'MINCED' : 'Minced'
  }).constant('INGREDIENT_CATEGORIES', {
    'VEGETABLES': 'Vegetables',
    'VEGETABLES_DISPLAY': 'Got Any Veggies?',
    'PROTEIN': 'Protein',
    'PROTEIN_DISPLAY': 'How About Protein?',
    'STARCH': 'Starches',
    'STARCH_DISPLAY': 'What Else?',
    'OTHER': 'Other'
  }).constant('RECIPE_TYPES', {
    'FULL': 'Full',
    'BYO': 'BYO',
    'ALACARTE': 'AlaCarte'
  }).constant('RECIPE_DISCLAIMERS', {
    'MODIFIED': 'Recipe has been modified to fit your ingredient selection'
  }).constant('TEXT_CHUNK_SIGNALS', {
    'NEWBULLET': '\n-',
    'OPENULIST': '%%%%%UB%%%%%',
    'CLOSEULIST': '%%%%%UE%%%%%',
    'OPENOLIST': '%%%%%OB%%%%%',
    'CLOSEOLIST': '%%%%%OE%%%%%',
    'NOLIST': 'NOLIST'
  }).constant('CONTENT_PIECE_TYPES', {
    'TEXT': 'text',
    'PICTURE': 'picture',
    'VIDEO': 'video'
  }).constant('ITEM_TYPES', {
    'NONE': 'None',
    'TIP': 'tip',
    'HOWTOSHOP': 'howToShop',
    'GLOSSARY': 'glossary',
    'TRAININGVIDEO': 'trainingVideo'
  }).constant('INPUTCATEGORIES', {
    'NOSUBCATEGORY': 'None'
  }).constant('EXIT_POPUP', {
    'TITLE': 'Exit Skillit?',
    'TEXT': 'Do you want to close and exit Skillit?'
  }).constant('LOGIN', {
    'MIN_PASSWORD_LENGTH': 8,
    'EMAIL_REGEX': /[^\s@]+@[^\s@]+\.[^\s@]+/,
    'EMAIL_CONFLICT': 'conflict_email',
    'EMAIL_CONFLICT_MESSAGE': 'A user with the supplied email already exists!',
    'PASSWORD_REQUIRED': 'required_password',
    'PASSWORD_REQUIRED_MESSAGE': 'To sign up, you need a password',
    'EMAIL_REQUIRED': 'required_email',
    'EMAIL_REQUIRED_MESSAGE': 'To sign up, you need an email',
    'USERNAME_CONFLICT': 'required_username',
    'USERNAME_CONFLICT_MESSAGE': 'A user with the supplied username already exists!',
    'INVALID_EMAIL': 'invalid_email',
    'INVALID_EMAIL_MESSAGE': 'To sign up, you need to supply a valid email address',
    'BASIC': 'basic',
    'FACEBOOK': 'facebook',
    'GOOGLE': 'google',
    'TYPE': 'type',
    'SOCIALTOKEN': 'socialtoken'
  }).constant('USER', {
    'ID': 'userId',
    'AGES': ['teens', 'twenties', 'thirties', 'forties', 'fifties +']
  }).constant('RECIPE_BADGES', {
    'GLUTEN_FREE': 'main/assets/images/recipe_badges/gluten-free.png',
    'GLUTEN_FREE_NAME': 'G-F',
    'LEAN_PROTEIN': 'main/assets/images/recipe_badges/lean-protein.png',
    'LEAN_PROTEIN_NAME': 'Protein+',
    'PALEO': 'main/assets/images/recipe_badges/paleo.png',
    'PALEO_NAME': 'Paleo',
    'PESCATARIAN': 'main/assets/images/recipe_badges/seafood.png',
    'PESCATARIAN_NAME': 'Seafood',
    'QUICK_EATS': 'main/assets/images/recipe_badges/ready-soon.png',
    'QUICK_EATS_NAME': 'Quick',
    'VEGAN': 'main/assets/images/recipe_badges/vegan.png',
    'VEGAN_NAME': 'Vegan',
    'VEGETARIAN': 'main/assets/images/recipe_badges/vegatarian.png',
    'VEGETARIAN_NAME': 'Veggie'
 }).constant('INTRO_SLIDES', [
    {
        'header': 'Input Ingredients',
        'subtitle': 'Tell us what you got',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/input.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/ingredients.png'
    },
    {
        'header': 'Browse Recipes',
        'subtitle': 'We\'ll show what you can make',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/selection.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/selection.png'
    },
    {
        'header': 'Get Your Grub On',
        'subtitle': 'Click on steps for extra info',
        'screenshot_ios': 'main/assets/images/ios_walkthrough/present.png',
        'screenshot_android': 'main/assets/images/android_walkthrough/present.png'
    }
  ]).constant('PAGINATION', {
    'ITEMS_PER_PAGE': 25,
    'RECIPES_PAGE_SIZE': 7
  }).constant('MEALS_COOKED_SOURCE', {
    'COOK_TAB': 0,
    'RECIPES_TAB': 1,
    'FAVORITE': 2
  }).constant('SHARING', {
    'MESSAGE1': 'I just cooked ',
    'MESSAGE2': ' using Skillit!',
    'IMAGE': 'main/assets/images/skillit-orange-text.png',
    'SUBJECT': 'Skillin\' it',
    'LINK': 'https://skillitcooking.com/pages/app',
    'HASHTAG': '#skillingit'
  }).constant('LOADING', {
    'DEFAULT_TEMPLATE': '<p>Simmering</p><ion-spinner></ion-spinner>',
    'FETCHING_TEMPLATE': '<p>Brainstorming</p><ion-spinner></ion-spinner>',
    'COOKING_TEMPLATE': '<p>Prepping</p><ion-spinner></ion-spinner>',
    'UPDATE_TEMPLATE': '<p>Updating App</p><ion-spinner></ion-spinner>',
    'TIMEOUT': 400
  }).constant('KEYS', {
    'BLANK': 'blank'
  }).constant('FAREWELL_COPY', [
    'Get Your Grub On!',
    'Time To Eat!',
    'Get Ready To Feast!',
    'Grab a Fork and Dig In!',
    'Grab a Spork and Dig In!',
    'Enjoy Your Edible Masterpiece!',
    'It\'s Eating Time!',
    'Let\'s Grub!'
  ]).constant('STEP_ICONS', {
    'VIDEO': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAC2klEQVRoQ+2ZTXbaQAzH/wI3WYY5QekNTGBfsgCy5AalJwg9AfQEoScIPUHTXaCLkj003KDuCdwueSVWnw2m2Ab8MR4CPHsHT6PRTxrJ0phwIg+dCAcykEOLZBaRLCKKPJAdLUWOTaw2ckTMmq4Dry5AXF3uVgBBX+3M8P4ON2nkEWEsf7MBzhnI//0lHqZGuJqFxFYQ81ovwtJuAFQ9BkfVnJ7cCMx9MZx83qVyI4hZu2yB6BZEhfTskdTEmILn78W36XSTpgCIWS83QfRFcltFy9nA7LkkRtPf/g2CII3yT4CKiixJQS1/EoNJeyeIk9A57SmF3RSqYEMMJm92gxz0sVozfTYX/uPlOVpmvdIFoaPQnemoJlyJh7GnfHtBGuUeQHbJPfDH+iAGP3rrRvojMgLhbWIKwpVd8wF6nVhHlIWMj2I47ioDEYOx4xizcdlmpi4RXUSxK74MfxWDSXMXyJPMW9wFcWCqegHn+a6So8p4FMOx2yo5PL4cqXB87/xfsQ7i/rtsdfpSR9ZvFGMqhuPS9og00gdZATmlHXYxSSV//E5THhG/M+0Sz+C2bP68OMgqf87yPRC9S3qUDwfkPH8LUOtoQcx6pQNwW3ZEeLGILMYD2FFIpbPeO4hTflm7cybNFJ/dIPWKVIsSeCGeaR0QArODNE/oCzElELNRvgGjK5sHW4FVg2DRNN6llQfbIxfeax3HPBKh+z0OEITNI9eVKhjfpZNRtYLQCdFpvTVTtR3S+sNmdqcPkqxc0kaGKggmemAecUBqus6UH8l2p6H2JBWw5qVNt42br0zr5SYD/UOCYeY/BLTEcHK/yQfbL7GdfMm1wDm7R0p+IZHU8+46xiPIusfM6m+6KnXFon9WsHsmaEU8W0VQzm38vP1THGDbQO+zuKdiy0A+ZwBzI5XPCrKO3Pf6yBHZt2Fx98tA4npMtXwWEdUejqs/i0hcj6mWP5mI/ANrwhhC8mn+vAAAAABJRU5ErkJggg==',
    'TIP': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADs0lEQVRoQ+2aTVYaQRDH/zXwfNnFPkHwBGkdspYsAHfiCYInEE+gnkA8gXqC4M7BheMeDDmBcIGM2cX3nKm8bkBBvma0e8LzpTcs6K6uX1dXdXfVEN5JI1McQfHLJpxIApAA5cAsQbQ6Lp+7AHUB9YsOovBGXHU6JnR4E0hQzm8DXAGjMql0TPWY70FoANQQXusi5qiJbolBgoJcxUp2D8RVvfJGm7ZUHQ/hufA790lEJwIJSvkDgGuvXv24mikrATXRbJ/HHRILJChKCcqegtT+T7X5oMddcdlRlprbFoIEZXcPoPoiQdb+V9Zh3hdXt2fz5pgLEpTdU4Cq1pRMIphRF83W/qwhM0GWCuJJez4TXnt3GsxUkOWEGKjPOBLN1uFLmAmQoJQ/BOEgidVT7xtFuy99Zgwk2MoXwLhOXbGkE6oA4ITro9FsHKTs3pk95LgHVlcSAMQ5gD4l1XlOf194ra/D/59ArGypkf1sRf7IFtMg/WtH5s74iW0bBNwVXntNG1yDFDeqcJxTg2bvi7IOoubgHdFsN/ogxn1juCTDa7umUj5i+JKp5V4Ir12hYEvmwNk749ZIUaDwWkRBeaMGOMcpzmt+KuYdCkruGYi+mZeeokTGEQWlvA/Cpp1p+UR47drAD+sA7Vma54KCcp7tCE8pavWj481/kFhWTOMc0UcJ/35PFnFVrsnkZe7ZWClZpO8jNqNWWiDgEwVi7yGVGki0T1YfU2mBRI/r+tL4q+TeE9HHWJEoSadUQLgnvHauf/u1dU1JA2Qwx+A9IiWc7I8kix2rbxog9Lim3u7PT92yqzLi27EUjNvJNgjzuWi2dQLxGcTGu8QiiD7NnVAOMynjWRTjoZi7YBrmbCtmk+DRvvBun3LSUxJ0bgdEn+Punn/Sj3Ejmq3C6NyTIAW5yiuZrpVwbISae3gI5ctC0PTcb1FKpoy/bDDaLzgsTKs7zs7GLxnMPIixqPXS6kuVXWH+CSeszKtczbaIrdM+sZ/wCR7Cw0XF0ek+UnJVufl74jmNDuAeiKrisuXHETsZtXThM3NtPA8cR5vhs5X4cPSMiDN0/EC0lQOOo4nyA+b6oqLnLFGjZYVjEHQOKo2moxDBB9gHRY04Jeh5eg2T2G+r3o6spi5RfMhKhFEO5IwnrTnqIuN08eexs8h5ky4mBWX3lRlA7gFogML6W1czqdLT+idMPgyUj8IzU1/1mIDQB6J+s0dcnZrIVltGfY7E7ANRZ9mUn39pLEq5zArPsuBfagL1XBkHgq4AAAAASUVORK5CYII=',
    'SEASONING': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAC/0lEQVRoQ+2aT3YSQRDGvwJ0a9oLaG5AAnthkSE7kxOIJxBPADmBeALxBCa7MFmIeyYhJzC5gE2WIlC+ASHh30x1T8c3jxe2VHXXr7/u6uoCwpZ8aEs44AxEl/I7eJ6rA1wF0U7sAjH3AWphMDxRnV4/1j7GwB1IpdAE6IN5QPxZtYOaud+ihzsQr6BFSixHzNxXfqBSA/LLK/SJ6IVpQMx899IP4rfi09YyXVoA2is2QKiLXRknyu82xPYRhs7OyGwOXSmyNDDV7jqb39lAWwciVcO1nXNFXAcoHc85yNMZkS79BjvniizPo+eli5tSZBPvo4MkXGixu3OQhTPC6IHQUO3umT7I50HZOoiO5tERyuq82xFH+78uRO0VjkD0TR7Y+KNqXzbl9pstnSqivUILRO/kgfGZagf3CskdVyydgejD/Gtw7qdxLL+HKl0PK2M1/iE7KhydKDI5yJnclbEaoUP45B2MdpOq4gakUvwOoGQFMoU5VX5wbO0PJG8+6Mp+Dch8ShLExJf5WPnBqe04iRRJtKWWIw63GI/K6qLXs4FJBuIVr0DI20y81ie8QAfDss15sQbRB/tVZDJfnEHMBrLMYvYgtuk2lpxvVDvYjTVbMkgAUuyA8MZ0QpG9xSX5uCBLmUhci1kUk48Hwnyt/GAlEWhPoGRqQJivwaPqulQ6LedzzchtmQ4QWWkeeZGmAkQYhD4slsAIS5vVj3CMh47uz8h4/F5dXLbislPkPZQKEOGFFtknTgUIZN2SyNdkKkAYP5TfjS3pI9NwSkB6yu/uxZ6RqIIzFSAAJD8XRLZW0wISvvjAmSayf27Vee9mps6kQTF69go0ri30t5blSw1I3L6K+35rQMbDPdOXYoIL0bQZFyfD9HvbX3ntQaJKDFnM662Yvyo/qJoOYQ0STmTeIo0OL1SDMqP8wwQhBUoGMvn/SbZp1u/dJATfEY9KpmdjNloikHlanXThUQXorXQF7+34Fjz5c03TpnviFMQ8ePceThRxH5b5iH8BQBZzQkDAvqsAAAAASUVORK5CYII='
  }).constant('EVENTS', {
    'SIGNIN_START': 'signInStart'
  });
