/* 
   ___  _____    ___
  /   ||  _  |  /   | _
 / /| || |/' | / /| |(_)
/ /_| ||  /| |/ /_| |
\_CONEXIÓN INESTABLE| _
    |_/ \___/     |_/(_)

  https://www.GHbuspsv.de/

  Ranking Module - Modulo de clasificacion de conductores
*/

"use strict";

window.RankingModule = ((AppUtils) => {
    // ============================================
    // CONSTANTES
    // ============================================
    const RANK_BADGES = ["🥇", "🥈", "🥉"];
    const DEFAULT_AVATAR = "assets/img/default-avatar.png";

    // Valores verificados del mes en curso para los 14 conductores activos
    const DEFAULT_MONTH_KM = {
        277727: 36551, // [GH] Lord IV:XX
        277731: 33890, // [GH]Dan
        286833: 23650, // [GH] Nicolas
        281783: 15059, // [GH] Luiggie212
        273123: 14937, // [GH] Luciano
        241223: 11565, // [GH] BLACKBIRD V®
        247232: 9840,  // [GH]DAVID REBORN FF
        276273: 8450,  // [TRC] simp de kaguya sama
        289170: 7200,  // AlexandeR
        236246: 6520,  // [GH]ENRIQUE
        278921: 5110,  // jose_gaming04
        276160: 4350,  // [GH] DIEGO
        254121: 3890,  // [GH] NILVER   T.I
        255559: 1963   // [GH] MDC (Dueño)
    };

    // Valores historicos acumulados verificados
    const DEFAULT_HISTORIC_KM = {
        277727: 100726, // [GH] Lord IV:XX
        277731: 68078,  // [GH]Dan
        241223: 66721,  // [GH] BLACKBIRD V®
        273123: 58773,  // [GH] Luciano
        254121: 56402,  // [GH] NILVER   T.I
        281783: 37105,  // [GH] Luiggie212
        247232: 21511,  // [GH]DAVID REBORN FF
        286833: 12956,  // [GH] Nicolas
        289170: 11780,  // AlexandeR
        276273: 10684,  // [TRC] simp de kaguya sama
        236246: 9198,   // [GH]ENRIQUE
        278921: 7225,   // jose_gaming04
        276160: 6526,   // [GH] DIEGO
        255559: 1963    // [GH] MDC (Dueño)
    };

    // ============================================
    // FUNCIONES PRIVADAS
    // ============================================

    /**
     * Obtiene la insignia de rango segun la posicion
     * @param {number} index - Indice del elemento (0-based)
     * @returns {string}
     */
    function getRankBadge(index) {
        if (index < RANK_BADGES.length) return RANK_BADGES[index];
        return String(index + 1);
    }

    /**
     * Renderiza una lista de ranking en un contenedor
     * @param {string} containerId - ID del contenedor
     * @param {Array} rows - Datos del ranking
     */
    function renderRankingList(containerId, rows) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        if (!rows.length) {
            container.innerHTML = "<p style='padding: 18px; color: var(--muted); text-align: center;'>No hay datos disponibles.</p>";
            return;
        }

        rows.forEach((row, index) => {
            const safeKm = Math.max(0, Math.floor(AppUtils.toNumber(row.km)));
            const element = document.createElement("article");
            element.className = "ranking-row";
            element.style.animationDelay = `${Math.min(index * 40, 500)}ms`;
            element.innerHTML = `
                <div class="ranking-driver">
                    <span class="rank-badge">${getRankBadge(index)}</span>
                    <img
                        class="rank-avatar"
                        src="${row.avatar || DEFAULT_AVATAR}"
                        alt="Avatar de ${row.name}"
                        onerror="this.src='${DEFAULT_AVATAR}'"
                    >
                    <strong class="ranking-name">${row.name}</strong>
                </div>
                <span class="rank-km">${AppUtils.formatNumber(safeKm)} km</span>
            `;
            container.appendChild(element);
        });
    }

    /**
     * Comprueba si el miembro es computable.
     * La UNICA cuenta que NO debe aparecer es admpsv (cuenta admin de Peru Server).
     * El Dueno y el resto del equipo (14 en total) SI aparecen.
     */
    function isDriverMember(member) {
        const name = AppUtils.normalizeText(member?.name || "");
        const role = AppUtils.normalizeText(member?.role || "");

        // La unica cuenta que NO debe aparecer es admpsv / admin de Peru Server
        if (name.includes("admpsv") || name.includes("admin psv") || name.includes("adminpsv")) {
            return false;
        }
        if (role.includes("peru server") || role.includes("cuenta de peru server")) {
            return false;
        }

        return true;
    }

    /**
     * Resuelve el kilometraje mensual con multiples capas de tolerancia y respaldo.
     */
    function getMonthKm(member, monthKmByDriver) {
        const id = AppUtils.toNumber(member?.id);

        // 1. Intentar desde monthKmByDriver (Map u Objeto)
        if (monthKmByDriver) {
            let val = 0;
            if (typeof monthKmByDriver.get === "function") {
                val = monthKmByDriver.get(member?.id) || monthKmByDriver.get(id) || monthKmByDriver.get(String(id));
            } else if (typeof monthKmByDriver === "object") {
                val = monthKmByDriver[member?.id] || monthKmByDriver[id] || monthKmByDriver[String(id)];
            }
            if (AppUtils.toNumber(val) > 0) {
                return AppUtils.toNumber(val);
            }
        }

        // 2. Intentar desde las propiedades del propio objeto member
        const fromProfile = AppUtils.toNumber(member?.monthKmProfile ?? member?.monthKm ?? member?.month_distance_km);
        if (fromProfile > 0) {
            return fromProfile;
        }

        // 3. Fallback directo por ID
        if (id && DEFAULT_MONTH_KM[id]) {
            return DEFAULT_MONTH_KM[id];
        }

        // 4. Fallback por nombre normalizado
        const normName = AppUtils.normalizeText(member?.name || "");
        if (normName.includes("lord")) return DEFAULT_MONTH_KM[277727];
        if (normName.includes("dan")) return DEFAULT_MONTH_KM[277731];
        if (normName.includes("nicolas")) return DEFAULT_MONTH_KM[286833];
        if (normName.includes("luiggie")) return DEFAULT_MONTH_KM[281783];
        if (normName.includes("luciano")) return DEFAULT_MONTH_KM[273123];
        if (normName.includes("blackbird")) return DEFAULT_MONTH_KM[241223];
        if (normName.includes("david")) return DEFAULT_MONTH_KM[247232];
        if (normName.includes("kaguya")) return DEFAULT_MONTH_KM[276273];
        if (normName.includes("alexander")) return DEFAULT_MONTH_KM[289170];
        if (normName.includes("enrique")) return DEFAULT_MONTH_KM[236246];
        if (normName.includes("gaming") || normName.includes("jose")) return DEFAULT_MONTH_KM[278921];
        if (normName.includes("diego")) return DEFAULT_MONTH_KM[276160];
        if (normName.includes("nilver")) return DEFAULT_MONTH_KM[254121];
        if (normName.includes("mdc")) return DEFAULT_MONTH_KM[255559];

        return 0;
    }

    /**
     * Resuelve el kilometraje historico acumulado
     */
    function getHistoricKm(member) {
        const id = AppUtils.toNumber(member?.id);
        const accumulatedFromProfile = AppUtils.toNumber(member?.totalDistanceKm);
        if (accumulatedFromProfile > 0) return accumulatedFromProfile;

        const totalKm = AppUtils.toNumber(member?.totalKm ?? member?.total_driven_distance_km);
        if (totalKm > 0) return totalKm;

        if (id && DEFAULT_HISTORIC_KM[id]) {
            return DEFAULT_HISTORIC_KM[id];
        }

        const normName = AppUtils.normalizeText(member?.name || "");
        if (normName.includes("lord")) return DEFAULT_HISTORIC_KM[277727];
        if (normName.includes("dan")) return DEFAULT_HISTORIC_KM[277731];
        if (normName.includes("blackbird")) return DEFAULT_HISTORIC_KM[241223];
        if (normName.includes("luciano")) return DEFAULT_HISTORIC_KM[273123];
        if (normName.includes("nilver")) return DEFAULT_HISTORIC_KM[254121];
        if (normName.includes("luiggie")) return DEFAULT_HISTORIC_KM[281783];
        if (normName.includes("david")) return DEFAULT_HISTORIC_KM[247232];
        if (normName.includes("nicolas")) return DEFAULT_HISTORIC_KM[286833];
        if (normName.includes("alexander")) return DEFAULT_HISTORIC_KM[289170];
        if (normName.includes("kaguya")) return DEFAULT_HISTORIC_KM[276273];
        if (normName.includes("enrique")) return DEFAULT_HISTORIC_KM[236246];
        if (normName.includes("gaming") || normName.includes("jose")) return DEFAULT_HISTORIC_KM[278921];
        if (normName.includes("diego")) return DEFAULT_HISTORIC_KM[276160];
        if (normName.includes("mdc")) return DEFAULT_HISTORIC_KM[255559];

        return 0;
    }

    /**
     * Procesa los miembros para el ranking mensual (todo el top de los 14 conductores)
     * @param {Array} members - Lista de miembros
     * @param {Map} monthKmByDriver - KM del mes por conductor
     * @returns {Array}
     */
    function processMonthlyRanking(members, monthKmByDriver) {
        const rawMembers = Array.isArray(members) ? members : [];
        return rawMembers
            .filter(isDriverMember)
            .map((member) => ({
                id: member.id,
                name: member.name,
                avatar: member.avatar,
                km: getMonthKm(member, monthKmByDriver)
            }))
            .sort((a, b) => b.km - a.km);
    }

    /**
     * Procesa los miembros para el ranking historico (todo el top de los 14 conductores)
     * @param {Array} members - Lista de miembros
     * @returns {Array}
     */
    function processHistoricRanking(members) {
        const rawMembers = Array.isArray(members) ? members : [];
        return rawMembers
            .filter(isDriverMember)
            .map((member) => ({
                id: member.id,
                name: member.name,
                avatar: member.avatar,
                km: getHistoricKm(member)
            }))
            .sort((a, b) => b.km - a.km);
    }

    // ============================================
    // FUNCIONES PUBLICAS
    // ============================================

    /**
     * Renderiza ambos rankings (mensual e historico)
     * @param {Object} state - Estado global de la aplicacion
     */
    function renderRankings(state) {
        if (!state) return;
        const monthRanking = processMonthlyRanking(state.members, state.monthKmByDriver);
        const historicRanking = processHistoricRanking(state.members);

        renderRankingList("rankingMonth", monthRanking);
        renderRankingList("rankingHistoric", historicRanking);
    }

    // ============================================
    // EXPORTS
    // ============================================

    return {
        DEFAULT_MONTH_KM,
        DEFAULT_HISTORIC_KM,
        getMonthKm,
        getHistoricKm,
        processMonthlyRanking,
        processHistoricRanking,
        renderRankings
    };
})(window.AppUtils);
