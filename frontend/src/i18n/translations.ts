const translations = {
  es: {
    // Login
    'login.password': 'Contraseña',
    'login.error': 'Email o contraseña incorrectos',
    'login.loading': 'Ingresando...',
    'login.submit': 'Ingresar',

    // Dashboard
    'dashboard.title': '🏆 Penca Mundial 2026',
    'dashboard.subtitle': 'Pronostica los partidos, suma puntos y domina la tabla.',
    'dashboard.tab.upcoming': 'Próximos',
    'dashboard.tab.results': 'Mis Resultados',
    'dashboard.tab.ranking': 'Ranking',

    // MatchCard
    'match.group': 'Grupo',
    'match.saved': '✓ Predicción guardada',
    'match.saving': 'Guardando...',
    'match.update': 'Actualizar predicción',
    'match.save': 'Guardar predicción',

    // PastMatchCard
    'past.myPrediction': 'Tu pronóstico',
    'past.final': 'Finalizado',
    'past.point': 'punto',
    'past.points': 'puntos',

    // UserProfile
    'profile.back': '← Volver',
    'profile.loading': 'Cargando...',
    'profile.totalPoints': 'pts totales',
    'profile.predictions': 'pronósticos',
    'profile.empty': 'aún no tiene pronósticos registrados.',
    'profile.position': 'Puesto',
    'profile.predictionOf': 'Pronóstico de',

    // Sidebar
    'sidebar.profile': '👤 Mi Perfil',
    'sidebar.settings': '⚙️ Configuración',
    'sidebar.logout': '🚪 Cerrar sesión',
    'sidebar.language': 'Idioma',
    'sidebar.switchTo': 'English',
    'sidebar.langFlag': '🇺🇸',
    'sidebar.uploadPhoto': 'Cambiar foto',
    'sidebar.removePhoto': 'Eliminar foto',
    'sidebar.uploading': 'Subiendo...',

    // MatchHistory
    'history.empty': '😶 Todavía no hay resultados registrados. ¡Los partidos aparecerán aquí una vez que finalicen!',

    // Ranking
    'ranking.empty': '🏆 ¡Aún no hay participantes en este ranking! Sé el primero en sumar puntos.',
    'ranking.pos': 'Pos',
    'ranking.participant': 'Participante',
    'ranking.trend': 'Tendencia',
    'ranking.points': 'Puntos',
    'ranking.place': 'Puesto',
    'ranking.pts': 'pts',
    'ranking.rising': '▲ Subiendo',
    'ranking.risingIcon': '▲',
    'ranking.falling': '▼ Bajando',
    'ranking.fallingIcon': '▼',
    'ranking.steady': '= Manteniendo',
    'ranking.steadyIcon': '-',
  },

  en: {
    // Login
    'login.password': 'Password',
    'login.error': 'Incorrect email or password',
    'login.loading': 'Signing in...',
    'login.submit': 'Sign in',

    // Dashboard
    'dashboard.title': '🏆 World Cup Penca 2026',
    'dashboard.subtitle': 'Predict matches, earn points and dominate the leaderboard.',
    'dashboard.tab.upcoming': 'Upcoming',
    'dashboard.tab.results': 'My Results',
    'dashboard.tab.ranking': 'Ranking',

    // MatchCard
    'match.group': 'Group',
    'match.saved': '✓ Prediction saved',
    'match.saving': 'Saving...',
    'match.update': 'Update prediction',
    'match.save': 'Save prediction',

    // PastMatchCard
    'past.myPrediction': 'Your prediction',
    'past.final': 'Final',
    'past.point': 'point',
    'past.points': 'points',

    // UserProfile
    'profile.back': '← Back',
    'profile.loading': 'Loading...',
    'profile.totalPoints': 'total pts',
    'profile.predictions': 'predictions',
    'profile.empty': 'has no predictions yet.',
    'profile.position': 'Rank',
    'profile.predictionOf': 'Prediction by',

    // Sidebar
    'sidebar.profile': '👤 My Profile',
    'sidebar.settings': '⚙️ Settings',
    'sidebar.logout': '🚪 Sign out',
    'sidebar.language': 'Language',
    'sidebar.switchTo': 'Español',
    'sidebar.langFlag': '🇺🇾',
    'sidebar.uploadPhoto': 'Change photo',
    'sidebar.removePhoto': 'Remove photo',
    'sidebar.uploading': 'Uploading...',

    // MatchHistory
    'history.empty': '😶 No results yet. Matches will appear here once they\'re finished!',

    // Ranking
    'ranking.empty': '🏆 No participants in this ranking yet! Be the first to earn points.',
    'ranking.pos': 'Pos',
    'ranking.participant': 'Participant',
    'ranking.trend': 'Trend',
    'ranking.points': 'Points',
    'ranking.place': 'Rank',
    'ranking.pts': 'pts',
    'ranking.rising': '▲ Rising',
    'ranking.risingIcon': '▲',
    'ranking.falling': '▼ Falling',
    'ranking.fallingIcon': '▼',
    'ranking.steady': '= Holding',
    'ranking.steadyIcon': '-',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;
export { translations };
