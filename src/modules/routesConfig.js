import {BiAlignLeft} from 'react-icons/bi';

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddIcon from '@mui/icons-material/Add';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import InputIcon from '@mui/icons-material/Input';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LogoutIcon from '@mui/icons-material/Logout';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import SettingsIcon from '@mui/icons-material/Settings';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
const rolesRoutesConfig = {
  APP_CLIENT: [
    /* {
      id: 'activeSubscription',
      title: 'activeSubscription',
      messageId: 'sidebar.sample.subscription.active',
      type: 'item',
      url: '/sample/subscription/active',
    }, */
    {
      id: 'planRegistration',
      title: 'planRegistration',
      messageId: 'sidebar.sample.planRegistration',
      type: 'item',
      url: '/sample/planRegistration',
    },
    {
      id: 'billing',
      title: 'billing',
      messageId: 'sidebar.sample.billing',
      type: 'item',
      url: '/sample/myBilling',
    },

    {
      id: 'ecommerce',
      title: 'ecommerce',
      messageId: 'sidebar.sample.ecommerce',
      type: 'collapse',
      icon: <StorefrontIcon fontSize='small' />,
      children: [
        {
          id: 'orderTable',
          title: 'Orders Table',
          messageId: 'sidebar.sample.order',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/orders/table',
        },
      ],
    },
    {
      id: 'ecommerce',
      title: 'ecommerce',
      messageId: 'sidebar.sample.admin',
      type: 'collapse',
      icon: <StorefrontIcon fontSize='small' />,
      children: [
        {
          id: 'orderTable',
          title: 'Orders Table',
          messageId: 'sidebar.sample.adminTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/admin/table',
        },
      ],
    },
    {
      id: 'crm',
      title: 'CRM',
      messageId: 'sidebar.sample.crm',
      type: 'collapse',
      icon: <CampaignIcon fontSize='small' />,
      children: [
        {
          id: 'campaignsTable',
          title: 'Tabla de Campañas',
          messageId: 'sidebar.sample.viewCampaign',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/crm/views',
        },
        {
          id: 'campaignsTable',
          title: 'Tabla de citas',
          messageId: 'sidebar.sample.viewAppoinment',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/appointment/views',
        },
      ],
    },
    {
      id: 'crm',
      title: 'SALES',
      messageId: 'sidebar.sample.sales',
      type: 'collapse',
      icon: <PointOfSaleIcon fontSize='small' />,
      children: [
        {
          id: 'campaignsTable',
          title: 'Sales Table',
          messageId: 'sidebar.sample.sales',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/sales/table',
        },
        {
          id: 'campaignsTable',
          title: 'Sales Table',
          messageId: 'sidebar.sample.orders',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/orders/table',
        },
      ],
    },
    {
      id: 'finances',
      title: 'Finances',
      messageId: 'sidebar.sample.finances',
      type: 'collapse',
      icon: <LocalAtmOutlinedIcon fontSize='small' />,
      children: [
        {
          id: 'movements0',
          title: 'Movements table',
          messageId: 'sidebar.sample.movements',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/contableMovements',
        },
        {
          id: 'movements',
          title: 'Movements table',
          messageId: 'sidebar.sample.ingressEgress',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/finances/table',
        },
        {
          id: 'referralGuides',
          title: 'ReferralGuides',
          messageId: 'sidebar.sample.referralGuides',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/referral-guide/table',
        },
        {
          id: 'bills',
          title: 'Bills',
          messageId: 'sidebar.sample.bills',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/bills/table',
        },
        {
          id: 'receipts',
          title: 'receipts',
          messageId: 'sidebar.sample.receipts',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/receipts/table',
        },
        {
          id: 'creditNotes',
          title: 'CreditNotes',
          messageId: 'sidebar.sample.notes',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/notes/table',
        },
      ],
    },
    {
      id: 'inventory',
      title: 'Inventory',
      messageId: 'sidebar.sample.inventory',
      type: 'collapse',
      icon: <InventoryOutlinedIcon fontSize='small' />,
      children: [
        {
          id: 'inventoryTable',
          title: 'inventory table',
          messageId: 'sidebar.sample.inventoryStock',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/inventory/table',
        },
        {
          id: 'inputsTable',
          title: 'Inputs table',
          messageId: 'sidebar.sample.inputs',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/inputs/table',
        },
        {
          id: 'outputsTable',
          title: 'Outputs table',
          messageId: 'sidebar.sample.outputs',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/outputs/table',
        },
      ],
    },
    {
      id: 'distribution',
      title: 'distribution',
      messageId: 'sidebar.sample.distribution',
      type: 'collapse',
      icon: <LocalShippingOutlinedIcon fontSize='small' />,
      children: [
        {
          id: 'routesTable',
          title: 'Routes table',
          messageId: 'sidebar.sample.routes',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/distribution/predefined-routes',
        },
        {
          id: 'distributionsTable',
          title: 'Distributions table',
          messageId: 'sidebar.sample.distributions',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/distribution/distributions',
        },
        {
          id: 'referralGuides',
          title: 'ReferralGuides',
          messageId: 'sidebar.sample.referralGuides',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/referral-guide/table',
        },
        {
          id: 'referralGuides',
          title: 'ReferralGuideCustomize',
          messageId: 'sidebar.sample.customize',
          type: 'item',
          icon: <SettingsIcon fontSize='small' />,
          url: '/sample/referral-guide/customize',
        },
        /* {
          id: 'createRoute',
          title: 'createRoute',
          messageId: 'sidebar.sample.createRoute',
          type: 'item',
          icon: <ForkRightIcon fontSize='small' />,
          url: '/sample/distribution/create-routes',
        }, */
        /* {
          id: 'createDistribution',
          title: 'Crear dsitribución',
          messageId: 'sidebar.sample.createDistribution',
          type: 'item',
          icon: <MapIcon fontSize='small' />,
          url: '/sample/distribution/new-distribution',
        }, */
      ],
    },
    {
      id: 'configurations',
      title: 'Configurations',
      messageId: 'sidebar.sample.configuration',
      type: 'collapse',
      icon: <SettingsIcon fontSize='small' />,
      children: [
        {
          id: 'productsTable',
          title: 'products table',
          messageId: 'sidebar.sample.productsTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/products/table',
        },
        {
          id: 'clientsTable',
          title: 'Tabla de clientes',
          messageId: 'sidebar.sample.clientsTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/clients/table',
        },
        {
          id: 'providersTable',
          title: 'Providers Table',
          messageId: 'sidebar.sample.providersTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/providers/table',
        },
        {
          id: 'carriersTable',
          title: 'Carriers Table',
          messageId: 'sidebar.sample.carriersTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/carriers/table',
        },
        {
          id: 'driversTable',
          title: 'Drivers Table',
          messageId: 'sidebar.sample.driversTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/drivers/table',
        },
        {
          id: 'locationsTable',
          title: 'Locations Table',
          messageId: 'sidebar.sample.locationsTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/locations/table',
        },
        {
          id: 'parametersTable',
          title: 'Parameters Table',
          messageId: 'sidebar.sample.parametersTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/parameters/update',
        },
        {
          id: 'campaignsTable',
          title: 'Tabla de agentes',
          messageId: 'sidebar.sample.viewAgents',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/agents/table',
        },
        {
          id: 'campaignsTable',
          title: 'Notification Table',
          messageId: 'sidebar.sample.viewNotifications',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/notifications/table',
        },
        {
          id: 'campaignsTable',
          title: 'Specialist Table',
          messageId: 'sidebar.sample.viewSpecialists',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/specialists/table',
        },
        {
          id: 'bulkLoad',
          title: 'BulkLoad Table',
          messageId: 'sidebar.sample.bulkLoad',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/bulkLoad',
        },
      ],
    },
    {
      id: 'explorer',
      title: 'explorer',
      messageId: 'sidebar.sample.fileExplorer',
      type: 'item',
      icon: <FolderOutlinedIcon fontSize='small' />,
      url: '/sample/explorer',
    },

    // {
    //   id: 'graphics',
    //   title: 'graphics',
    //   messageId: 'sidebar.sample.graphics',
    //   type: 'item',
    //   icon: <AssessmentOutlinedIcon fontSize='small' />,
    //   url: '/sample/graphics',
    // },
    // {
    //   id: 'clients',
    //   title: 'Clients',
    //   messageId: 'sidebar.sample.clients',
    //   type: 'collapse',
    //   icon: <PersonPinOutlinedIcon fontSize='small' />,
    //   children: [
    //     {
    //       id: 'clientsTable',
    //       title: 'Tabla de clientes',
    //       messageId: 'sidebar.sample.clientsTable',
    //       type: 'item',
    //       icon: <TableRowsOutlinedIcon fontSize='small' />,
    //       url: '/sample/clients/table',
    //     },
    //     {
    //       id: 'newClient',
    //       title: 'Nuevo Cliente',
    //       messageId: 'sidebar.sample.newClient',
    //       type: 'item',
    //       icon: <AddIcon fontSize='small' />,
    //       url: '/sample/clients/new',
    //     },
    //   ],
    // },
    // {
    //   id: 'providers',
    //   title: 'Providers',
    //   messageId: 'sidebar.sample.providers',
    //   type: 'collapse',
    //   icon: <BusinessIcon fontSize='small' />,
    //   children: [
    //     {
    //       id: 'providersTable',
    //       title: 'Providers Table',
    //       messageId: 'sidebar.sample.providersTable',
    //       type: 'item',
    //       icon: <TableRowsOutlinedIcon fontSize='small' />,
    //       url: '/sample/providers/table',
    //     },
    //     {
    //       id: 'newProvider',
    //       title: 'New provider',
    //       messageId: 'sidebar.sample.newProvider',
    //       type: 'item',
    //       icon: <AddIcon fontSize='small' />,
    //       url: '/sample/providers/new',
    //     },
    //   ],
    // },
    // {
    //   id: 'taskManagement',
    //   title: 'Task Management',
    //   messageId: 'sidebar.sample.taskManagement',
    //   type: 'item',
    //   icon: <FolderOpenOutlinedIcon fontSize='small' />,
    //   url: '/sample/todo/[...all]',
    //   as: '/sample/todo/all',
    //   // children: [
    //   //   {
    //   //     id: 'taskTable',
    //   //     title: 'Task Table',
    //   //     messageId: 'sidebar.sample.taskTable',
    //   //     type: 'item',
    //   //     icon: <TableRowsOutlinedIcon fontSize='small' />,
    //   //     // url: '/sample/todo',
    //   //     url: '/sample/todo/[...all]',
    //   //     as: '/sample/todo/all',
    //   //   },
    //   //   {
    //   //     id: 'newTask',
    //   //     title: 'New task',
    //   //     messageId: 'sidebar.sample.newTask',
    //   //     type: 'item',
    //   //     icon: <AddIcon fontSize='small' />,
    //   //     url: '/sample/todo',
    //   //   },
    //   // ],
    // },
  ],
  APP_ADMIN: [
    {
      id: 'inventory',
      title: 'Inventory',
      messageId: 'sidebar.sample.inventory',
      type: 'collapse',
      icon: <InventoryOutlinedIcon fontSize='small' />,
      children: [
        {
          id: 'inventoryTable',
          title: 'inventory table',
          messageId: 'sidebar.sample.inventoryStock',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/inventory/table',
        },
        {
          id: 'inputsTable',
          title: 'Inputs table',
          messageId: 'sidebar.sample.inputs',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/inputs/table',
        },
        {
          id: 'outputsTable',
          title: 'Outputs table',
          messageId: 'sidebar.sample.outputs',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/outputs/table',
        },
      ],
    },
    {
      id: 'finances',
      title: 'Finances',
      messageId: 'sidebar.sample.finances',
      type: 'collapse',
      icon: <LocalAtmOutlinedIcon fontSize='small' />,
      children: [
        {
          id: 'movements0',
          title: 'Movements table',
          messageId: 'sidebar.sample.movements',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/finances/table',
        },
        {
          id: 'movements',
          title: 'Movements table',
          messageId: 'sidebar.sample.ingressEgress',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/finances/table',
        },
        {
          id: 'referralGuides',
          title: 'ReferralGuides',
          messageId: 'sidebar.sample.referralGuides',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/referral-guide/table',
        },
        {
          id: 'bills',
          title: 'Bills',
          messageId: 'sidebar.sample.bills',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/bills/table',
        },
        {
          id: 'creditNotes',
          title: 'CreditNotes',
          messageId: 'sidebar.sample.creditNotes',
          type: 'item',
          icon: <ReceiptOutlinedIcon fontSize='small' />,
          url: '/sample/credit-notes/table',
        },
        // {
        //   id: 'newEarnings',
        //   title: 'New earnings',
        //   messageId: 'sidebar.sample.newEarning',
        //   type: 'item',
        //   icon: <AddIcon fontSize='small' />,
        //   url: '/sample/finances/new-earning',
        // },
        // {
        //   id: 'newExpense',
        //   title: 'New expense',
        //   messageId: 'sidebar.sample.newExpense',
        //   type: 'item',
        //   icon: <AddIcon fontSize='small' />,
        //   url: '/sample/finances/new-expense',
        // },
      ],
    },
    {
      id: 'configurations',
      title: 'Configurations',
      messageId: 'sidebar.sample.configuration',
      type: 'collapse',
      icon: <Inventory2OutlinedIcon fontSize='small' />,
      children: [
        {
          id: 'productsTable',
          title: 'products table',
          messageId: 'sidebar.sample.productsTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/products/table',
        },
        {
          id: 'clientsTable',
          title: 'Tabla de clientes',
          messageId: 'sidebar.sample.clientsTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/clients/table',
        },
        {
          id: 'providersTable',
          title: 'Providers Table',
          messageId: 'sidebar.sample.providersTable',
          type: 'item',
          icon: <TableRowsOutlinedIcon fontSize='small' />,
          url: '/sample/providers/table',
        },

        // {
        //   id: 'newProduct',
        //   title: 'new product',
        //   messageId: 'sidebar.sample.newProduct',
        //   type: 'item',
        //   icon: <AddIcon fontSize='small' />,
        //   url: '/sample/products/new',
        // },
      ],
    },
    // {
    //   id: 'clients',
    //   title: 'Clients',
    //   messageId: 'sidebar.sample.clients',
    //   type: 'collapse',
    //   icon: <PersonPinOutlinedIcon fontSize='small' />,
    //   children: [
    //     {
    //       id: 'clientsTable',
    //       title: 'Tabla de clientes',
    //       messageId: 'sidebar.sample.clientsTable',
    //       type: 'item',
    //       icon: <TableRowsOutlinedIcon fontSize='small' />,
    //       url: '/sample/clients/table',
    //     },
    //     {
    //       id: 'newClient',
    //       title: 'Nuevo Cliente',
    //       messageId: 'sidebar.sample.newClient',
    //       type: 'item',
    //       icon: <AddIcon fontSize='small' />,
    //       url: '/sample/clients/new',
    //     },
    //   ],
    // },
    // {
    //   id: 'providers',
    //   title: 'Providers',
    //   messageId: 'sidebar.sample.providers',
    //   type: 'collapse',
    //   icon: <BusinessIcon fontSize='small' />,
    //   children: [
    //     {
    //       id: 'providersTable',
    //       title: 'Providers Table',
    //       messageId: 'sidebar.sample.providersTable',
    //       type: 'item',
    //       icon: <TableRowsOutlinedIcon fontSize='small' />,
    //       url: '/sample/providers/table',
    //     },
    //     {
    //       id: 'newProvider',
    //       title: 'New provider',
    //       messageId: 'sidebar.sample.newProvider',
    //       type: 'item',
    //       icon: <AddIcon fontSize='small' />,
    //       url: '/sample/providers/new',
    //     },
    //   ],
    // },
    {
      id: 'taskManagement',
      title: 'Task Management',
      messageId: 'sidebar.sample.taskManagement',
      type: 'item',
      icon: <FolderOpenOutlinedIcon fontSize='small' />,
      url: '/sample/todo/[...all]',
      as: '/sample/todo/all',
      // children: [
      //   {
      //     id: 'taskTable',
      //     title: 'Task Table',
      //     messageId: 'sidebar.sample.taskTable',
      //     type: 'item',
      //     icon: <TableRowsOutlinedIcon fontSize='small' />,
      //     // url: '/sample/todo',
      //     url: '/sample/todo/[...all]',
      //     as: '/sample/todo/all',
      //   },
      //   {
      //     id: 'newTask',
      //     title: 'New task',
      //     messageId: 'sidebar.sample.newTask',
      //     type: 'item',
      //     icon: <AddIcon fontSize='small' />,
      //     url: '/sample/todo',
      //   },
      // ],
    },
  ],
};

const routesConfig = [
  {
    id: 'graphics',
    title: 'graphics',
    messageId: 'sidebar.sample.graphics',
    type: 'item',
    icon: <AssessmentOutlinedIcon fontSize='small' />,
    url: '/sample/graphics',
  },
  {
    id: 'inputs',
    title: 'Inputs',
    messageId: 'sidebar.sample.inputs',
    type: 'collapse',
    icon: <ExitToAppIcon fontSize='small' />,
    children: [
      {
        id: 'inputsTable',
        title: 'Inputs table',
        messageId: 'sidebar.sample.inputsTable',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/inputs/table',
      },
      {
        id: 'newInput',
        title: 'New input',
        messageId: 'sidebar.sample.newInput',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/inputs/new',
      },
    ],
  },
  {
    id: 'outputs',
    title: 'Outputs',
    messageId: 'sidebar.sample.outputs',
    type: 'collapse',
    icon: <LogoutIcon fontSize='small' />,
    children: [
      {
        id: 'outputsTable',
        title: 'Outputs table',
        messageId: 'sidebar.sample.outputsTable',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/outputs/table',
      },
      {
        id: 'newOutput',
        title: 'New Output',
        messageId: 'sidebar.sample.newOutput',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/outputs/new',
      },
    ],
  },
  {
    id: 'finances',
    title: 'Finances',
    messageId: 'sidebar.sample.finances',
    type: 'collapse',
    icon: <LocalAtmOutlinedIcon fontSize='small' />,
    children: [
      {
        id: 'movements',
        title: 'Movements table',
        messageId: 'sidebar.sample.movements',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/finances/table',
      },
      {
        id: 'referralGuides',
        title: 'ReferralGuides',
        messageId: 'sidebar.sample.referralGuides',
        type: 'item',
        icon: <ReceiptOutlinedIcon fontSize='small' />,
        url: '/sample/referral-guide/table',
      },
      {
        id: 'bills',
        title: 'Bills',
        messageId: 'sidebar.sample.bills',
        type: 'item',
        icon: <ReceiptOutlinedIcon fontSize='small' />,
        url: '/sample/bills/table',
      },
      {
        id: 'creditNotes',
        title: 'CreditNotes',
        messageId: 'sidebar.sample.creditNotes',
        type: 'item',
        icon: <ReceiptOutlinedIcon fontSize='small' />,
        url: '/sample/credit-notes/table',
      },
      {
        id: 'newEarnings',
        title: 'New earnings',
        messageId: 'sidebar.sample.newEarning',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/finances/new-earning',
      },
      {
        id: 'newExpense',
        title: 'New expense',
        messageId: 'sidebar.sample.newExpense',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/finances/new-expense',
      },
    ],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    messageId: 'sidebar.sample.inventory',
    type: 'collapse',
    icon: <InventoryOutlinedIcon fontSize='small' />,
    children: [
      {
        id: 'inventoryTable',
        title: 'inventory table',
        messageId: 'sidebar.sample.inventoryTable',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/inventory/table',
      },
    ],
  },
  {
    id: 'products',
    title: 'products',
    messageId: 'sidebar.sample.products',
    type: 'collapse',
    icon: <Inventory2OutlinedIcon fontSize='small' />,
    children: [
      {
        id: 'productsTable',
        title: 'products table',
        messageId: 'sidebar.sample.productsTable',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/products/table',
      },
      {
        id: 'newProduct',
        title: 'new product',
        messageId: 'sidebar.sample.newProduct',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/products/new',
      },
    ],
  },
  {
    id: 'clients',
    title: 'Clients',
    messageId: 'sidebar.sample.clients',
    type: 'collapse',
    icon: <PersonPinOutlinedIcon fontSize='small' />,
    children: [
      {
        id: 'clientsTable',
        title: 'Tabla de clientes',
        messageId: 'sidebar.sample.clientsTable',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/clients/table',
      },
      {
        id: 'newClient',
        title: 'Nuevo Cliente',
        messageId: 'sidebar.sample.newClient',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/clients/new',
      },
    ],
  },
  {
    id: 'providers',
    title: 'Providers',
    messageId: 'sidebar.sample.providers',
    type: 'collapse',
    icon: <BusinessIcon fontSize='small' />,
    children: [
      {
        id: 'providersTable',
        title: 'Providers Table',
        messageId: 'sidebar.sample.providersTable',
        type: 'item',
        icon: <TableRowsOutlinedIcon fontSize='small' />,
        url: '/sample/providers/table',
      },
      {
        id: 'newProvider',
        title: 'New provider',
        messageId: 'sidebar.sample.newProvider',
        type: 'item',
        icon: <AddIcon fontSize='small' />,
        url: '/sample/providers/new',
      },
    ],
  },
  {
    id: 'taskManagement',
    title: 'Task Management',
    messageId: 'sidebar.sample.taskManagement',
    type: 'item',
    icon: <FolderOpenOutlinedIcon fontSize='small' />,
    url: '/sample/todo/[...all]',
    as: '/sample/todo/all',
    // children: [
    //   {
    //     id: 'taskTable',
    //     title: 'Task Table',
    //     messageId: 'sidebar.sample.taskTable',
    //     type: 'item',
    //     icon: <TableRowsOutlinedIcon fontSize='small' />,
    //     // url: '/sample/todo',
    //     url: '/sample/todo/[...all]',
    //     as: '/sample/todo/all',
    //   },
    //   {
    //     id: 'newTask',
    //     title: 'New task',
    //     messageId: 'sidebar.sample.newTask',
    //     type: 'item',
    //     icon: <AddIcon fontSize='small' />,
    //     url: '/sample/todo',
    //   },
    // ],
  },
];

export default rolesRoutesConfig;
