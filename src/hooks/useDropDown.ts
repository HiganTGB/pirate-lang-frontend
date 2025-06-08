import { ref } from 'vue';

export function useDropDown() {
    const subMenuStates = ref<Record<string, boolean>>({});

    const toggleSubMenu = (id: string) => {
        subMenuStates.value[id] = !subMenuStates.value[id];
    };

    const isSubMenuOpen = (id: string) => {
        return subMenuStates.value[id] || false;
    };

    return {
        toggleSubMenu,
        isSubMenuOpen,
    };
}