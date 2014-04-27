require 'spec_helper'

describe Cms::AdminsController do

  context 'as an authorized admin'do

    before :each do
      email = "admin.#{rand(999)}@example.com"
      @request.env['devise.mapping'] = Devise.mappings[:admin]
      sign_in Fabricate(:admin, email: email)
    end

    render_views

    describe 'GET index' do
      it 'shows the admin list' do
        get :index
        expect(response).to be_success
        admin_attributes = Fabricate.attributes_for :admin
        expect(response.body).to include admin_attributes[:first_name]
        expect(response.body).to include admin_attributes[:last_name]
      end
    end

    describe 'GET new' do
      it 'renders the admin form' do
        get :new
        expect(response).to be_success
        expect(response.body).to have_tag 'input#admin_first_name'
        expect(response.body).to have_tag 'input#admin_last_name'
      end
    end

  end

  context 'when not authorized' do

    describe 'GET index' do
      it 'redirects to login action' do
        get :index
        expect(response).to redirect_to new_admin_session_path
      end
    end

    describe 'GET new' do
      it 'redirects to login action' do
        get :new
        expect(response).to redirect_to new_admin_session_path
      end
    end

  end

end
