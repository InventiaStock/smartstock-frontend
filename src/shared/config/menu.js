// One menu configuration for both business types.
// businessType: 'minimarket' | 'bodega'
export const menuItems = [
  {
    key: 'dashboard',
    path: '/dashboard',
    icon: 'pi-chart-bar',
    businessTypes: [
      'minimarket'
    ]
  },
  {
    key: 'home',
    path: '/dashboard',
    icon: 'pi-home',
    businessTypes: [
      'bodega'
    ]
  },
  {
    key: 'products',
    path: '/products',
    icon: 'pi-box',
    businessTypes: [
      'minimarket',
      'bodega'
    ]
  },
  {
    key: 'sales',
    path: '/sales',
    icon: 'pi-dollar',
    businessTypes: [
      'minimarket',
      'bodega'
    ]
  },
  {
    key: 'purchases',
    path: '/purchases',
    icon: 'pi-shopping-bag',
    businessTypes: [
      'minimarket',
      'bodega'
    ]
  },
  {
    key: 'sensors',
    path: '/sensors',
    icon: 'pi-wifi',
    businessTypes: [
      'minimarket',
      'bodega'
    ]
  },
  {
    key: 'alerts',
    path: '/alerts',
    icon: 'pi-bell',
    businessTypes: [
      'minimarket',
      'bodega'
    ]
  },
  {
    key: 'comparison',
    path: '/comparison',
    icon: 'pi-arrows-h',
    businessTypes: [
      'minimarket'
    ]
  },
  {
    key: 'reports',
    path: '/reports',
    icon: 'pi-file',
    businessTypes: [
      'minimarket'
    ]
  }
]

export const menuFor = (businessType) =>
  menuItems.filter((item) => item.businessTypes.includes(businessType))
