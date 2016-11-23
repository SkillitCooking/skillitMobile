'use strict';

angular.module('main')
  .constant('Config', {
    ENV: {
        /*inject-env*/
        'SERVER_URL': 'http://107.170.199.250:3000/api/',
    'CHANNEL': 'dev'
        /*endinject*/
    },
    BUILD : {
        /*inject-build*/
        /*endinject*/
    }
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
    'COOK': 'Cook',
    'CUSTOM': 'Custom',
    'CUT': 'Cut',
    'DRY': 'Dry',
    'EQUIPMENTPREP': 'EquipmentPrep',
    'HEAT': 'Heat',
    'PLACE': 'Place',
    'PREHEAT': 'PreheatOven',
    'SAUTEE': 'Saute',
    'SEASON': 'Season',
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
    'PROTEIN': 'Protein',
    'STARCH': 'Starches',
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
    'GOOGLE': 'google'
  }).constant('USER', {
    'ID': 'userId',
    'AGES': ['teens', 'twenties', 'thirties', 'forties', 'fifties +']
  }).constant('RECIPE_BADGES', {
    'EASY_CLEANUP': 'main/assets/images/rounded-rectangle-easy-cleanup.jpg',
    'LEAN_PROTEIN': 'main/assets/images/rounded-rectangle-lean-protein.jpg',
    'MINIMAL_PREP': 'main/assets/images/rounded-rectangle-minimal-prep.jpg',
    'PALEO': 'main/assets/images/rounded-rectangle-paleo.jpg',
    'PESCATARIAN': 'main/assets/images/rounded-rectangle-pescatarian.jpg',
    'QUICK_EATS': 'main/assets/images/rounded-rectangle-quick-eats.jpg',
    'REDUCETARIAN': 'main/assets/images/rounded-rectangle-reducetarian.jpg',
    'VEGAN': 'main/assets/images/rounded-rectangle-vegan.jpg',
    'VEGETARIAN': 'main/assets/images/rounded-rectangle-vegetarian.jpg',
    'WELL_ROUNDED': 'main/assets/images/rounded-rectangle-well-rounded.jpg'
  }).constant('INTRO_SLIDES', [
    {
        'header': 'Input Ingredients',
        'subtitle': 'Tell us what ya got, and we\'ll show you how to make it!',
        'screenshot_ios': 'main/assets/images/slide-1-ios-ingredients.png',
        'screenshot_android': 'main/assets/images/slide-1-android-ingredients.png'
    },
    {
        'header': 'Choose a Recipe',
        'subtitle': 'Find a tasty recipe or build your own. Add some tasty sides if you like',
        'screenshot_ios': 'main/assets/images/slide-2-ios-selection.png',
        'screenshot_android': 'main/assets/images/slide-2-android-selection.png'
    },
    {
        'header': 'Make what You Want',
        'subtitle': 'Bro brah, these recipes are like super-duper customizable',
        'screenshot_ios': 'main/assets/images/slide-3-ios-present-1.png',
        'screenshot_android': 'main/assets/images/slide-3-android-instructions-1.png'
    },
    {
        'header': 'Time to Cook',
        'subtitle': 'Every recipe includes a video and step-by-step instructions',
        'screenshot_ios': 'main/assets/images/slide-4-ios-present-2.png',
        'screenshot_android': 'main/assets/images/slide-4-android-instructions-2.png'
    },
    {
        'header': 'Browsing is Nice',
        'subtitle': 'Doods, you can just go and look at sick food pics',
        'screenshot_ios': 'main/assets/images/slide-5-ios-browse.png',
        'screenshot_android': 'main/assets/images/slide-5-android-browse.png'
    },
    {
        'header': 'Hey Guurrrl',
        'subtitle': 'You like learning? We got some nice learning over here',
        'screenshot_ios': 'main/assets/images/slide-6-ios-learn.png',
        'screenshot_android': 'main/assets/images/slide-6-android-learn.png'
    }
  ]);